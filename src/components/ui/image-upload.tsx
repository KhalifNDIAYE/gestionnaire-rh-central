
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  currentImage?: string;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  currentImage,
  maxSizeInMB = 2,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Vérifier le type de fichier
    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: `Formats acceptés: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    // Vérifier la taille
    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximum est de ${maxSizeInMB}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image (optionnel)</Label>
      
      {preview ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </Button>
                <p className="text-sm text-gray-500">
                  ou glissez-déposez une image ici
                </p>
                <p className="text-xs text-gray-400">
                  Formats acceptés: {acceptedFormats.map(f => f.split('/')[1]).join(', ')} • Max {maxSizeInMB}MB
                </p>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
