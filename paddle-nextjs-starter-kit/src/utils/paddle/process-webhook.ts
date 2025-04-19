import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { createClient } from '@/utils/supabase/server-internal';

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    console.log('Processing webhook event:', eventData.eventType);
    
    try {
      // Always process customer events first
      if (eventData.eventType === EventName.CustomerCreated || eventData.eventType === EventName.CustomerUpdated) {
        await this.updateCustomerData(eventData);
        return;
      }

      // Then handle subscription events
      if (eventData.eventType === EventName.SubscriptionCreated || eventData.eventType === EventName.SubscriptionUpdated) {
        // Ensure customer exists before creating subscription
        const supabase = await createClient();
        const { data: customerExists } = await supabase
          .from('customers')
          .select('customer_id')
          .eq('customer_id', (eventData as SubscriptionCreatedEvent | SubscriptionUpdatedEvent).data.customerId)
          .single();

        if (!customerExists) {
          // If customer doesn't exist, try to fetch and create it
          const paddle = (await import('@/utils/paddle/get-paddle-instance')).getPaddleInstance();
          const customer = await paddle.customers.get(
            (eventData as SubscriptionCreatedEvent | SubscriptionUpdatedEvent).data.customerId
          );
          
          if (customer) {
            await this.updateCustomerData({
              eventType: EventName.CustomerCreated,
              data: customer,
              occurredAt: new Date().toISOString(),
            } as CustomerCreatedEvent);
          }
        }

        await this.updateSubscriptionData(eventData);
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
      throw error;
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    try {
      console.log('Updating subscription data:', {
        subscription_id: eventData.data.id,
        customer_id: eventData.data.customerId
      });
      
      const supabase = await createClient();
      const response = await supabase
        .from('subscriptions')
        .upsert({
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? '',
          product_id: eventData.data.items[0].price?.productId ?? '',
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
        })
        .select();

      if (response.error) {
        throw new Error(`Failed to update subscription: ${response.error.message}`);
      }
      
      console.log('Subscription update response:', response);
    } catch (e) {
      console.error('Error updating subscription:', e);
      throw e;
    }
  }

  private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
    try {
      console.log('Updating customer data:', {
        customer_id: eventData.data.id,
        email: eventData.data.email
      });
      
      const supabase = await createClient();
      const response = await supabase
        .from('customers')
        .upsert({
          customer_id: eventData.data.id,
          email: eventData.data.email,
        })
        .select();

      if (response.error) {
        throw new Error(`Failed to update customer: ${response.error.message}`);
      }
      
      console.log('Customer update response:', response);
    } catch (e) {
      console.error('Error updating customer:', e);
      throw e;
    }
  }
}
