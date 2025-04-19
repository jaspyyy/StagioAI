"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Loader2, X, Check, RefreshCw, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase, uploadImage, checkRenderStatus } from '@/lib/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'home-office', label: 'Home Office' },
  { value: 'dining-room', label: 'Dining Room' },
  { value: 'kids-room', label: 'Kids Room' },
  { value: 'outdoor', label: 'Outdoor' },
];

const STYLE_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'modern', label: 'Modern' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'midcentury', label: 'Midcentury' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'coastal', label: 'Coastal' },
  { value: 'farmhouse', label: 'Farm House' },
];

// This should be moved to an environment variable
const VSAI_API_KEY = process.env.NEXT_PUBLIC_VSAI_API_KEY || 'your_api_key_here';

interface Project {
  id: string;
  imageUrl: string;
  roomType: string;
  style: string;
  status: 'analyzing' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
  createdAt: Date;
  hasFurniture?: boolean;
  furniturePercentage?: number;
  removeFurniture: boolean;
  lastChecked?: string;
  progressPercent?: number;
}

export function DashboardLandingPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [removeFurniture, setRemoveFurniture] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [furnitureAnalysis, setFurnitureAnalysis] = useState<any | null>(null);
  const [showRoomOptions, setShowRoomOptions] = useState(false);
  const [showFurnitureOptions, setShowFurnitureOptions] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isCheckingDatabase, setIsCheckingDatabase] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const supabaseAuth = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [session, setSession] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [closeAfterAnalysis, setCloseAfterAnalysis] = useState(false);
  
  const hasProcessingProjects = useMemo(() => 
    projects.some(project => project.status === 'processing'), 
    [projects]
  );
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefresh && hasProcessingProjects) {
      intervalId = setInterval(() => {
        console.log("Auto-refreshing projects list...");
        loadProjects();
      }, 10000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, hasProcessingProjects]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      if (session) {
        setUser(session.user);
        setSession(session);
        loadProjects();
      }
    };
    
    checkSession();
  }, []);

  // Cleanup object URL when component unmounts or when selectedImage changes
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // Set up an interval to refresh projects periodically
  useEffect(() => {
    // Load projects initially
    const initialLoad = async () => {
      try {
        await loadProjects();
      } catch (error) {
        console.error('Error on initial project load:', error);
      }
    };
    
    initialLoad();
    
    // Set up an interval to refresh projects every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        await loadProjects();
      } catch (error) {
        console.error('Error refreshing projects:', error);
      }
    }, 30000); // 30 seconds
    
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [/* loadProjects is stable */]); // No dependencies needed as loadProjects is defined at component level

  const setupProjectsTable = async () => {
    console.log("Setting up projects table...");
    setIsCheckingDatabase(true);
    
    try {
      // Make a POST request to the setup API endpoint
      const response = await fetch('/api/setup-projects-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error setting up projects table:', errorData);
        throw new Error(errorData.error || 'Failed to set up projects table');
      }
      
      const setupResponse = await response.json();
      console.log('Setup response:', setupResponse);
      
      toast({
        title: "Setup Complete",
        description: setupResponse.message || "Database setup completed successfully",
      });
      
      return setupResponse;
    } catch (error) {
      console.error('Error setting up projects table:', error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to set up database",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCheckingDatabase(false);
    }
  };

  const loadProjects = async () => {
    try {
      console.log('Loading projects from database');
      setIsLoadingProjects(true);

      // Check if the user is authenticated
      if (!session?.user) {
        console.log('No authenticated user, showing empty projects list');
        setProjects([]);
        setIsLoadingProjects(false);
        return;
      }

      // Query the database for user's projects, using snake_case column names
      const { data: projectsData, error } = await supabaseAuth
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        
        // Check if it's a "relation does not exist" error, which means the table isn't set up
        if (
          error.message.includes('relation "projects" does not exist') ||
          error.message.includes('does not exist') ||
          error.code === '42P01'
        ) {
          console.log('Projects table does not exist, attempting to set up database');
          setDatabaseError('Projects table does not exist. Setting up database...');
          
          try {
            await setupProjectsTable();
            // After setting up, try loading projects again with a slight delay
            setTimeout(() => loadProjects(), 2000);
          } catch (setupError) {
            console.error('Error setting up database:', setupError);
            setDatabaseError('Failed to set up database. Please try again later.');
          }
        } else {
          // For other errors, just display the error
          setDatabaseError(error.message);
        }
        setProjects([]);
      } else {
        // Map projects from snake_case to camelCase for frontend use
        const formattedProjects: Project[] = projectsData.map((project: any) => ({
          id: project.id,
          renderId: project.renderid,  // Changed from render_id to renderid to match database column
          imageUrl: project.image_url,
          resultUrl: project.result_url,
          roomType: project.room_type,
          style: project.style,
          status: project.status,
          createdAt: project.created_at,
          hasFurniture: project.has_furniture,
          furniturePercentage: project.furniture_percentage,
          removeFurniture: project.remove_furniture,
          error: project.error,
          lastChecked: project.last_checked,
          // Add estimated percent complete for processing projects
          progressPercent: project.status === 'processing' ? calculateProgress(project.created_at, project.last_checked) : 100
        }));

        console.log(`Loaded ${formattedProjects.length} projects`);
        setProjects(formattedProjects);
        setDatabaseError(null);
      }
    } catch (error) {
      console.error('Error in loadProjects:', error);
      setDatabaseError(error instanceof Error ? error.message : String(error));
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create an object URL for the selected file
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      // Reset states related to furniture and room options
      setFurnitureAnalysis(null);
      setRemoveFurniture(false);
      setShowFurnitureOptions(false);
      // Automatically show room options when an image is uploaded
      setShowRoomOptions(true);
    }
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    // Check auth session first
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session || !session.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }
    return uploadImage(file, session.user.id);
  };

  const analyzeFurniture = async () => {
    if (!selectedFile || !roomType || !style) {
      toast({
        title: "Missing information",
        description: "Please select an image, room type, and style before analyzing",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalyzeError(undefined);
    
    try {
      console.log(`Analyzing image: ${selectedFile?.name} with room type: ${roomType}, style: ${style}`);
      
      // First upload the image to get a stable URL
      let publicImageUrl;
      try {
        // Upload the file to storage to get a public URL
        publicImageUrl = await uploadToStorage(selectedFile);
        console.log(`Using image URL for analysis: ${publicImageUrl.substring(0, 50)}...`);
        
        // Immediately set the image URL to ensure we're using the correct one
        setImageUrl(publicImageUrl);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to prepare image for analysis: ${error.message}`);
      }
      
      // Now test the API connection
      const testResponse = await fetch('/api/vsai-proxy/test');
      
      // Clone the response before reading it to avoid consuming the body
      const testResponseClone = testResponse.clone();
      
      // Try to parse as JSON first
      let testResult;
      try {
        testResult = await testResponse.json();
      } catch (error) {
        console.error('Error parsing test response as JSON:', error);
        const textResponse = await testResponseClone.text();
        throw new Error(`API connection test failed: ${textResponse}`);
      }
      
      if (!testResult.success) {
        console.error('API connection test failed:', testResult);
        throw new Error(`API connection failed: ${JSON.stringify(testResult)}`);
      }
      
      console.log('API connection test successful, proceeding with analysis');
      
      // Now call the analysis endpoint with the public URL and room type
      const response = await fetch('/api/vsai-proxy/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image_url: publicImageUrl,
          room_type: roomType
        }),
      });

      if (!response.ok) {
        let errorMessage;
        try {
        const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || 'Unknown error';
          console.error('Analysis failed:', errorData);
        } catch (e) {
          errorMessage = await response.text();
          console.error('Analysis failed with non-JSON response:', errorMessage);
        }
        
        throw new Error(`Analysis failed (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      console.log('Analysis successful:', data);
      
      // Make sure we have a standardized structure for the furniture analysis
      // The UI is looking for 'hasFurniture' property to determine if furniture is detected
      let standardizedData = {
        hasFurniture: false,
        furniturePercentage: 0,
        items: []
      };
      
      // Handle different response formats
      if (data.hasFurniture !== undefined) {
        // Our API already returned the correct format
        standardizedData.hasFurniture = !!data.hasFurniture;
        standardizedData.furniturePercentage = data.furniturePercentage || data.percentage || 0;
        standardizedData.items = data.items || [];
      } else if (data.items && data.items.length > 0) {
        // We have items, so there is furniture
        standardizedData.hasFurniture = true;
        standardizedData.items = data.items;
        standardizedData.furniturePercentage = data.furniture_percentage || 0;
      } else if (data.furniture_percentage && data.furniture_percentage > 0) {
        // We have furniture percentage but no items
        standardizedData.hasFurniture = true;
        standardizedData.furniturePercentage = data.furniture_percentage;
      }
      
      console.log('Setting furniture analysis to:', standardizedData);
      setFurnitureAnalysis(standardizedData);
      
      // Analysis is complete, but we DON'T create a render yet
      toast({
        title: "Analysis complete",
        description: standardizedData.hasFurniture 
          ? `Furniture detected (${Math.round(standardizedData.furniturePercentage)}% of image).`
          : "No furniture detected in the image.",
      });
      
      // Make sure we're using the ORIGINAL uploaded image URL, not any that might have
      // been returned in the mock data response
      console.log(`Ensuring image URL remains: ${publicImageUrl.substring(0, 50)}...`);
      
      // Confirm we're using the image that was uploaded
      setImageUrl(publicImageUrl);
      
      // We don't close the dialog automatically - the user needs to explicitly click "Create Project"
      // to generate the render. This keeps the dialog open to show analysis results and allows
      // them to make additional adjustments before creating the actual render.
      
      return standardizedData;
    } catch (error) {
      console.error('Error during analysis or project creation:', error);
      setAnalyzeError(error instanceof Error ? error.message : String(error));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image or create project.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setIsUploading(false);
    }
  };

  const clearFurniture = () => {
    setFurnitureAnalysis(null);
    setAnalyzeError(undefined);
  };
  
  const resetImage = () => {
    // Clean up the object URL if it exists
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
    setSelectedFile(null);
    clearFurniture();
  };

  const handleSubmit = async () => {
    if (!selectedFile || !roomType || !style || !imageUrl || !furnitureAnalysis) {
      toast({
        title: "Missing information",
        description: "Please analyze the image first and select all required fields (room type, style)",
        variant: "destructive",
      });
      return;
    }

    // We've already done the analysis, now create the render and project
    setIsUploading(true);
    
    try {
      // Check if user is authenticated
      if (!session || !session.user) {
        console.error('User session not available for project creation');
        toast({
          title: "Authentication Required",
          description: "Please sign in again to create projects",
          variant: "destructive",
        });
        throw new Error('Authentication required. Please sign in again.');
      }
      
      console.log('Session user ID:', session.user.id);
      console.log('User authenticated:', !!session.user);
      
      // Create render with Virtual Staging AI
      console.log(`Creating render with room type: ${roomType}, style: ${style}`);
      const renderResponse = await fetch('/api/vsai-proxy/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          room_type: roomType,
          style: style,
          remove_furniture: removeFurniture,
          variation_count: 1, // Explicitly request a single variation
        }),
      });

      if (!renderResponse.ok) {
        let errorMessage = 'Failed to create render';
        try {
          const errorData = await renderResponse.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          console.error('Render creation failed:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const renderData = await renderResponse.json();
      console.log('Render API response:', renderData);
      
      // Check that we have a render ID - accept either id or render_id
      const renderId = renderData.id || renderData.render_id;
      if (!renderId) {
        console.error('No render ID in response:', renderData);
        throw new Error('No render ID received from Virtual Staging AI');
      }
      
      console.log(`Render created successfully with ID: ${renderId}`);
      
      // Create project in Supabase - using snake_case column names to match the database schema
      const projectData = {
        renderid: renderId,  // Changed from render_id to renderid to match the database column name
        image_url: imageUrl,
        room_type: roomType,
        style: style,
        status: 'processing',
        has_furniture: !!furnitureAnalysis.hasFurniture,
        furniture_percentage: furnitureAnalysis.furniturePercentage || 0,
        remove_furniture: !!removeFurniture,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        last_checked: new Date().toISOString()
      };
      
      console.log('Inserting project into database with data:', {
        ...projectData,
        renderid: renderId,
        image_url: imageUrl.substring(0, 50) + '...',
      });
      
      // Make sure we're using the auth client directly
      let client = supabaseAuth;
      
      // Double-check that the client is valid
      if (!client) {
        console.error('Supabase client was not initialized');
        throw new Error('Database connection error. Please try again.');
      }
      
      // Verify the projects table exists first
      try {
        console.log('Verifying projects table exists...');
        const { data: tableExists, error: tableError } = await client
          .from('projects')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error('Error verifying projects table:', tableError);
          if (tableError.message.includes('does not exist')) {
            // Try to create the table if it doesn't exist
            console.log('Creating projects table...');
            await setupProjectsTable();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for table creation
          }
        } else {
          console.log('Projects table verified');
        }
      } catch (e) {
        console.error('Error verifying table:', e);
      }
      
      // Insert the project with detailed error handling
      console.log('Inserting project with user ID:', session.user.id);
      const { data: project, error } = await client
        .from('projects')
        .insert(projectData)
        .select('*')  // Return all columns
        .single();

      if (error) {
        console.error('Error inserting project:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // Log specific data fields for troubleshooting
        console.error('renderid value:', renderId);
        
        // Check for specific error types and provide helpful messages
        if (error.code === '42501') {
          throw new Error('Permission denied. You may need to sign in again.');
        } else if (error.code === '23505') {
          throw new Error('A project with this information already exists.');
        } else if (error.code === '23503') {
          throw new Error('User reference error. Please sign in again.');
        } else if (error.code === '23502') {
          // Not-null constraint violation
          const fieldName = error.message.match(/column "([^"]+)"/)?.[1] || 'a required field';
          throw new Error(`Database error: ${fieldName} cannot be null. Please check your input.`);
        } else {
          throw new Error(`Database error: ${error.message || error.code || 'Unknown error'}`);
        }
      }
      
      // Start checking the render status
      if (project) {
        console.log(`Project created successfully:`, project);
        console.log(`Starting status check for render ID: ${renderId}, project ID: ${project.id}`);
        // Start the status check process with a short delay to let the render process begin
        setTimeout(() => {
          checkRenderStatus(renderId, project.id);
        }, 5000);
      } else {
        console.warn('Project created but no data returned. This is unusual but not an error.');
      }
      
      // Close the dialog and reload projects
      setIsDialogOpen(false);
      await loadProjects();
      
      // Reset form
      setSelectedFile(null);
      setRoomType('');
      setStyle('');
      setFurnitureAnalysis(null);
      setRemoveFurniture(false);
      setImageUrl(null);
      
      toast({
        title: "Project Created",
        description: "Your image is being processed. The dashboard will automatically refresh when it's ready.",
      });
      
      // Make sure auto-refresh is enabled to show progress
      setAutoRefresh(true);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Project Creation Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = () => {
    loadProjects();
    toast({
      title: "Refreshing",
      description: "Updating projects list...",
    });
  };

  // Function to calculate approximate progress percentage
  const calculateProgress = (createdAt: string, lastChecked: string | null) => {
    // If we don't have lastChecked, use current time
    const now = new Date();
    const created = new Date(createdAt);
    const checked = lastChecked ? new Date(lastChecked) : now;
    
    // Estimate total processing time as 60 seconds
    const estimatedTotalTime = 60 * 1000; // 60 seconds in milliseconds
    
    // Calculate elapsed time since creation
    const elapsedTime = Math.min(
      checked.getTime() - created.getTime(),
      estimatedTotalTime
    );
    
    // Calculate progress as a percentage (0-100)
    return Math.min(Math.round((elapsedTime / estimatedTotalTime) * 100), 95);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-white mb-2">AI Virtual Staging</h2>
        <p className="text-gray-400">Create and view your AI virtually staged photos.</p>
      </div>

      {/* Projects Section */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-xl font-medium">My Projects</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isLoadingProjects}
              title="Refresh projects list"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingProjects ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                // Reset form state when dialog is closed
                setSelectedFile(null);
                setRoomType('');
                setStyle('');
                setFurnitureAnalysis(null);
                setRemoveFurniture(false);
                setShowRoomOptions(false);
                setShowFurnitureOptions(false);
              }
            }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </DialogTrigger>
              <DialogContent className="sm:max-w-[1200px] max-h-[800px] overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>Upload Photo</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Side: Image Upload */}
                  <div className="flex flex-col">
                    <label className="border-2 border-dashed border-gray-800 rounded-lg p-4 text-center cursor-pointer hover:border-gray-700 transition-colors h-[500px] flex flex-col justify-center items-center">
                      {selectedFile ? (
                        <>
                          <img
                            src={selectedImage || ''}
                            alt="Uploaded image"
                            className="max-h-[450px] max-w-full object-contain mb-2"
                          />
                          <div className="flex items-center justify-between w-full px-2">
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {selectedFile.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                resetImage();
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-500 mb-2" />
                          <p className="text-gray-400 mb-1">Drag & drop or click to upload</p>
                          <p className="text-xs text-gray-500">Recommended: High-resolution images of rooms</p>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Right Side: Options */}
                  <div className="flex flex-col gap-4 h-[500px] pt-2">
                    {/* Remove Furniture Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label>Remove Furniture</Label>
                      <Switch
                        checked={removeFurniture}
                        onCheckedChange={setRemoveFurniture}
                      />
                    </div>

                    {/* Room Type */}
                    <div className="flex flex-col gap-2">
                      <Label>Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_TYPES.map((room) => (
                            <SelectItem key={room.value} value={room.value}>
                              {room.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Room Style */}
                    <div className="flex flex-col gap-2">
                      <Label>Room Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room style" />
                        </SelectTrigger>
                        <SelectContent>
                          {STYLE_TYPES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Process Photo Button - Aligned to bottom */}
                    <div className="mt-auto">
                      <Button 
                        onClick={analyzeFurniture}
                        disabled={isAnalyzing || !selectedFile || !roomType || !style}
                        size="lg"
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Image className="h-5 w-5 mr-2" />
                            Process Photo
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {isLoadingProjects ? (
            <div className="text-gray-400 text-center py-8">
              Loading projects...
            </div>
          ) : databaseError ? (
            <div className="col-span-full bg-amber-900/20 border border-amber-900/50 rounded-lg p-6 text-center">
              <h3 className="text-amber-500 font-medium mb-2">Database Not Ready</h3>
              <p className="text-amber-300/80 mb-4">{databaseError}</p>
              {isCheckingDatabase ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span className="text-amber-500">Setting up database...</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={setupProjectsTable}>
                  Set Up Database
                </Button>
              )}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No photos yet. Upload your first photo to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {projects.map((project) => (
                <Card key={project.id} className="border border-gray-800 bg-gray-900/50 overflow-hidden">
                  <div className="relative h-44 bg-gray-800/50">
                    {project.status === 'processing' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <img
                      src={project.imageUrl}
                          alt={`${project.roomType} - ${project.style}`}
                          className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                        <div className="z-10 flex flex-col items-center justify-center bg-black/60 p-4 rounded-lg text-center">
                          <Loader2 className="h-6 w-6 animate-spin mb-2" />
                          <div className="text-sm font-medium">Processing image...</div>
                          <div className="w-full mt-2 bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                              style={{ width: `${project.progressPercent || 0}%` }}
                            ></div>
                  </div>
                          <div className="text-xs mt-1">{project.progressPercent || 0}% complete</div>
                        </div>
                      </div>
                    ) : project.status === 'failed' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20">
                        <img
                          src={project.imageUrl}
                          alt={`${project.roomType} - ${project.style}`}
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="z-10 flex flex-col items-center justify-center bg-black/60 p-4 rounded-lg">
                          <X className="h-6 w-6 text-red-500 mb-2" />
                          <div className="text-sm font-medium text-red-400">Processing failed</div>
                          {project.error && (
                            <div className="text-xs mt-1 text-red-300 max-w-[200px] truncate" title={project.error}>
                              {project.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : project.resultUrl ? (
                      <img
                        src={project.resultUrl}
                        alt={`${project.roomType} - ${project.style}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={project.imageUrl}
                        alt={`${project.roomType} - ${project.style}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium capitalize">{project.roomType} Room</h3>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {project.status === 'completed' ? (
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Done</span>
                          </div>
                        ) : project.status}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="capitalize">{project.style} style</span>
                      {project.createdAt && (
                        <span className="block mt-1">
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
