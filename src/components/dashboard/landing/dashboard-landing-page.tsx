"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

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
}

export function DashboardLandingPage() {
  const { toast } = useToast();
  const supabaseClient = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Image upload states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roomType, setRoomType] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [furnitureAnalysis, setFurnitureAnalysis] = useState<{hasFurniture: boolean, percentage: number} | null>(null);
  const [removeFurniture, setRemoveFurniture] = useState(false);
  const [showFurnitureOptions, setShowFurnitureOptions] = useState(false);
  const [showRoomOptions, setShowRoomOptions] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        console.log('Checking session from dashboard...');
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setAuthError(`Session error: ${error.message}`);
          setDebugInfo({ type: 'Session Error', message: error.message, details: error });
          return;
        }

        const session = data.session;
        console.log('Session data:', session);
        setDebugInfo({ type: 'Session Check', session: session });
        
        if (session?.user) {
          console.log('User is authenticated:', session.user);
          setUser(session.user);
          try {
            await loadProjects();
          } catch (err: any) {
            console.error('Error loading projects:', err);
            setDebugInfo({ 
              type: 'Projects Error', 
              message: err.message, 
              details: err 
            });
          }
        } else {
          console.log('No authenticated user, redirecting to sign in...');
          setAuthError('No authenticated session found');
          setDebugInfo({ type: 'No Session' });
          // Delay redirect to show error message
          setTimeout(() => {
            window.location.href = '/auth/signin';
          }, 2000);
        }
      } catch (error: any) {
        console.error('Error in getUser:', error);
        setAuthError(`Authentication error: ${error.message}`);
        setDebugInfo({ type: 'Auth Exception', message: error.message, details: error });
      } finally {
        setLoading(false);
      }
    };
    
    getUser();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setDebugInfo({ 
        type: 'Auth State Change',
        event: event,
        user: session?.user 
      });
      
      if (session?.user) {
        setUser(session.user);
        try {
          await loadProjects();
        } catch (err: any) {
          console.error('Error loading projects after auth change:', err);
        }
      } else {
        setUser(null);
        setProjects([]);
        setAuthError('Session ended');
        // Delay redirect to show error message
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 2000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProjects = async () => {
    try {
      console.log('Fetching projects...');
      
      // First, check if we can access the table at all
      const { error: checkError } = await supabaseClient
        .from('projects')
        .select('count');
        
      if (checkError) {
        console.error('Error accessing projects table:', checkError);
        toast({
          title: "Database Error",
          description: `Cannot access projects table: ${checkError.message}`,
          variant: "destructive",
        });
        setDebugInfo({ 
          type: 'Database Access Error', 
          message: checkError.message, 
          details: checkError 
        });
        return;
      }
      
      // Now get the actual projects with better error handling
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false }); // Try 'created_at' instead of 'createdAt'

      if (error) {
        console.error('Supabase error when fetching projects:', error);
        toast({
          title: "Query Error",
          description: `Error fetching projects: ${error.message}`,
          variant: "destructive",
        });
        setDebugInfo({ 
          type: 'Projects Query Error', 
          message: error.message, 
          details: error 
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log('No projects found for this user');
        setProjects([]);
        return;
      }

      console.log('Projects loaded successfully:', data);
      
      // Safely handle different column name formats
      setProjects(data.map(project => {
        // Determine the date field (could be createdAt or created_at)
        const dateField = project.createdAt ? project.createdAt : 
                          project.created_at ? project.created_at : 
                          new Date().toISOString();
        
        return {
          id: project.id,
          imageUrl: project.imageUrl || project.image_url,
          roomType: project.roomType || project.room_type,
          style: project.style,
          status: project.status || 'processing',
          resultUrl: project.resultUrl || project.result_url,
          error: project.error,
          createdAt: new Date(dateField),
          hasFurniture: project.hasFurniture || project.has_furniture,
          furniturePercentage: project.furniturePercentage || project.furniture_percentage,
          removeFurniture: project.removeFurniture || project.remove_furniture || false
        };
      }));
    } catch (error: any) {
      console.error('Unexpected error loading projects:', error);
      const errorMessage = typeof error === 'string' ? error : 
                          error.message ? error.message : 
                          'Unknown error occurred';
      
      toast({
        title: "Error",
        description: `Unexpected error: ${errorMessage}`,
        variant: "destructive",
      });
      
      setDebugInfo({ 
        type: 'Projects Unexpected Error', 
        message: errorMessage, 
        details: error.toString ? error.toString() : JSON.stringify(error)
      });
      
      // Don't rethrow the error, just return
      return;
    }
  };

  const uploadImage = async (file: File, userId: string): Promise<string> => {
    const timestamp = new Date().getTime();
    const fileName = `${userId}/${timestamp}-${file.name}`;
    const { data, error } = await supabaseClient.storage
      .from('virtual-staging')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('virtual-staging')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const analyzeFurniture = async (imageUrl: string) => {
    setIsAnalyzing(true);
    try {
      // Check if we have environment variables properly set up
      const envCheck = await fetch('/api/vsai-proxy/check-config');
      if (!envCheck.ok) {
        const errorData = await envCheck.json();
        throw new Error(errorData.error || 'API key not configured properly');
      }
      
      // Use our proxy route instead of calling the API directly
      const response = await fetch('/api/vsai-proxy/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('api key') || errorData.error?.includes('api key')) {
          throw new Error('API key configuration error: Your Virtual Staging AI API key is missing or invalid. Please check your environment variables.');
        }
        throw new Error(errorData.error || errorData.message || 'Failed to analyze furniture');
      }

      const data = await response.json();
      setFurnitureAnalysis({
        hasFurniture: data.has_furniture,
        percentage: data.furniture_percentage,
      });

      return data;
    } catch (error: any) {
      console.error('Error analyzing furniture:', error);
      
      // Handle API key specific error messages
      const errorMessage = error.message || "Failed to analyze furniture in the image.";
      const isApiKeyError = errorMessage.toLowerCase().includes('api key');
      
      toast({
        title: isApiKeyError ? "API Configuration Error" : "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setDebugInfo({
        type: 'Furniture Analysis Error',
        message: errorMessage,
        time: new Date().toISOString()
      });
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Verify authentication first
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create projects",
          variant: "destructive",
        });
        return;
      }

      if (!selectedFile || !roomType || !style) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      
      // Upload image if not already uploaded
      let imageUrl;
      try {
        imageUrl = await uploadImage(selectedFile, user.id);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload Error",
          description: `Failed to upload image: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Analyze furniture if not already done
      if (!furnitureAnalysis) {
        try {
          await analyzeFurniture(imageUrl);
        } catch (error: any) {
          console.error('Error analyzing furniture:', error);
          // Continue without furniture analysis if it fails
        }
      }
      
      // Create render with Virtual Staging AI
      try {
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
          }),
        });

        if (!renderResponse.ok) {
          const errorData = await renderResponse.json();
          throw new Error(errorData.error || 'Failed to create render');
        }

        const renderData = await renderResponse.json();
        
        // Create project in Supabase
        const { data, error } = await supabaseClient
          .from('projects')
          .insert({
            renderId: renderData.id,
            imageUrl,
            roomType,
            style,
            status: 'processing',
            hasFurniture: furnitureAnalysis?.hasFurniture || false,
            furniturePercentage: furnitureAnalysis?.percentage || 0,
            removeFurniture,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }
        
        // Reset form
        setSelectedFile(null);
        setRoomType('');
        setStyle('');
        setFurnitureAnalysis(null);
        setRemoveFurniture(false);
        setShowFurnitureOptions(false);
        setShowRoomOptions(false);
        setIsDialogOpen(false);
        
        // Reload projects to show the new one
        await loadProjects();
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        
      } catch (error: any) {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: `Failed to create project: ${error.message}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-medium text-white mb-4">Authentication Required</h2>
        <p className="text-gray-400 mb-4">{authError || 'Please sign in to access the dashboard.'}</p>
        <Button
          onClick={() => {
            window.location.href = '/auth/signin';
          }}
        >
          Sign In
        </Button>
        
        {/* Debug Info */}
        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-700 rounded-md max-w-xl w-full">
            <h3 className="text-sm font-medium text-white mb-2">Debug Information:</h3>
            <pre className="text-xs text-gray-300 overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">Virtual Staging</h2>
            <p className="text-gray-400">Create and manage your virtual staging projects.</p>
          </div>
          <div className="text-sm text-gray-400">
            Signed in as: {user.email}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Project Cards */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-white">My Projects</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Left Side: Image Upload */}
                <div className="flex flex-col gap-4">
                  <Label>Upload Image</Label>
                  <label className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center cursor-pointer hover:border-gray-700 transition-colors h-64 flex flex-col justify-center items-center">
                    {selectedFile ? (
                      <>
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="max-h-48 max-w-full object-contain mb-2"
                        />
                        <p className="text-sm text-gray-400 mt-2">{selectedFile.name}</p>
                        <Button 
                          variant="link" 
                          className="text-sm mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFile(null);
                            setFurnitureAnalysis(null);
                          }}
                        >
                          Change Image
                        </Button>
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
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setFurnitureAnalysis(null);
                          setShowFurnitureOptions(false);
                          setShowRoomOptions(false);
                        }
                      }}
                    />
                  </label>
                  
                  {isAnalyzing && (
                    <div className="flex items-center justify-center text-sm text-gray-400 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing image...
                    </div>
                  )}
                  
                  {furnitureAnalysis && (
                    <div className="text-sm text-gray-400 mt-2">
                      {furnitureAnalysis.hasFurniture ? (
                        <p>✓ Furniture detected ({Math.round(furnitureAnalysis.percentage)}% coverage)</p>
                      ) : (
                        <p>✓ No furniture detected in this image</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Right Side: Options */}
                <div className="flex flex-col gap-4">
                  {selectedFile && (
                    <>
                      {/* Analyze button - only show if analysis hasn't been done */}
                      {!furnitureAnalysis && !isAnalyzing && (
                        <Button 
                          onClick={async () => {
                            if (!selectedFile) return;
                            
                            try {
                              const imageUrl = await uploadImage(selectedFile, user.id);
                              await analyzeFurniture(imageUrl);
                              setShowFurnitureOptions(true);
                            } catch (error) {
                              console.error('Error analyzing image:', error);
                            }
                          }}
                          disabled={isAnalyzing || !selectedFile}
                          className="mb-4"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Analyzing...
                            </>
                          ) : (
                            'Analyze Image'
                          )}
                        </Button>
                      )}
                      
                      {/* Furniture Options */}
                      {furnitureAnalysis && (
                        <div className="space-y-4">
                          {/* Furniture Removal Option */}
                          {furnitureAnalysis.hasFurniture && (
                            <div className="flex items-center justify-between">
                              <Label htmlFor="remove-furniture" className="cursor-pointer">
                                Remove existing furniture
                              </Label>
                              <Switch
                                id="remove-furniture"
                                checked={removeFurniture}
                                onCheckedChange={setRemoveFurniture}
                              />
                            </div>
                          )}
                          
                          {/* Add Furniture Button */}
                          <Button 
                            onClick={() => setShowRoomOptions(true)}
                            variant="outline"
                            className="w-full"
                          >
                            Add Furniture
                          </Button>
                        </div>
                      )}
                      
                      {/* Room Type and Style Options */}
                      {showRoomOptions && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Room Type</Label>
                            <Select value={roomType} onValueChange={setRoomType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="living">Living Room</SelectItem>
                                <SelectItem value="bed">Bedroom</SelectItem>
                                <SelectItem value="dining">Dining Room</SelectItem>
                                <SelectItem value="kitchen">Kitchen</SelectItem>
                                <SelectItem value="bathroom">Bathroom</SelectItem>
                                <SelectItem value="office">Office</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Style</Label>
                            <Select value={style} onValueChange={setStyle}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select furniture style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="traditional">Traditional</SelectItem>
                                <SelectItem value="minimalist">Minimalist</SelectItem>
                                <SelectItem value="scandinavian">Scandinavian</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                                <SelectItem value="bohemian">Bohemian</SelectItem>
                                <SelectItem value="coastal">Coastal</SelectItem>
                                <SelectItem value="farmhouse">Farmhouse</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      {/* Submit Button */}
                      {showRoomOptions && roomType && style && (
                        <Button 
                          onClick={handleSubmit}
                          disabled={isUploading || !selectedFile || !roomType || !style}
                          className="mt-4"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Creating Project...
                            </>
                          ) : (
                            'Create Project'
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Projects */}
        {projects.length === 0 ? (
          <div className="text-center py-12 border border-gray-800 rounded-lg">
            <p className="text-gray-400">No projects yet. Create your first virtual staging project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-800 rounded-lg overflow-hidden">
                {/* Project card content */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 