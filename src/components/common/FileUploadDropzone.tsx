import { useCallback, useState, useRef, DragEvent } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

// Map of common file extensions to MIME types
const EXTENSION_TO_MIME: Record<string, string[]> = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  gif: ['image/gif'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  zip: ['application/zip', 'application/x-zip-compressed'],
  mp4: ['video/mp4'],
  mp3: ['audio/mpeg'],
  wav: ['audio/wav'],
  webp: ['image/webp'],
  svg: ['image/svg+xml'],
  txt: ['text/plain'],
  csv: ['text/csv'],
};

interface FileUploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  acceptedTypes?: string[]; // Can be extensions like 'pdf', 'jpg' OR MIME types like 'application/pdf'
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
  // For showing existing file
  existingFile?: {
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function FileUploadDropzone({
  onUpload,
  acceptedTypes,
  maxSizeMb = 10,
  disabled = false,
  className,
  existingFile,
  onDelete,
  isDeleting = false,
}: FileUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback(async (file: File) => {
    // Validate file type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const fileMimeType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Check if file is allowed - acceptedTypes can be extensions OR MIME types
      const isAllowed = acceptedTypes.some(acceptedType => {
        const normalizedType = acceptedType.toLowerCase();
        
        // If it looks like a MIME type (contains /)
        if (normalizedType.includes('/')) {
          return fileMimeType === normalizedType;
        }
        
        // Otherwise treat as extension
        // Check direct extension match
        if (fileExtension === normalizedType) {
          return true;
        }
        
        // Check if file's MIME type matches what we expect for this extension
        const expectedMimes = EXTENSION_TO_MIME[normalizedType];
        if (expectedMimes && expectedMimes.includes(fileMimeType)) {
          return true;
        }
        
        return false;
      });
      
      if (!isAllowed) {
        // Show user-friendly message with extensions
        const displayTypes = acceptedTypes.map(t => 
          t.includes('/') ? t.split('/').pop() : t
        ).join(', ').toUpperCase();
        setError(`Invalid file type. Allowed: ${displayTypes}`);
        return;
      }
    }

    // Validate file size
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > maxSizeMb) {
      setError(`File size (${fileSizeMb.toFixed(1)}MB) exceeds maximum allowed (${maxSizeMb}MB)`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      await onUpload(file);
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  }, [onUpload, maxSizeMb, acceptedTypes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (disabled || isUploading) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
            <Loader2 className="w-3 h-3" />
            Pending Review
          </span>
        );
    }
  };

  // Show existing file
  if (existingFile && !isUploading) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-100)]',
        className
      )}>
        <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{existingFile.name}</div>
          <div className="mt-1">{getStatusBadge(existingFile.status)}</div>
        </div>
        {onDelete && existingFile.status !== 'APPROVED' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isDeleting}
            className="hover:bg-red-500/10 hover:text-red-500"
            title="Delete file"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    );
  }

  // Show upload progress
  if (isUploading) {
    return (
      <div className={cn(
        'p-4 rounded-lg border-2 border-dashed border-blue-500 bg-blue-500/5',
        className
      )}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <div className="flex-1">
            <div className="text-sm font-medium">Uploading...</div>
            <div className="mt-2 h-2 bg-[var(--surface-200)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show dropzone
  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'p-4 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
        isDragActive 
          ? 'border-blue-500 bg-blue-500/5' 
          : 'border-[var(--border)] hover:border-blue-500/50',
        disabled && 'opacity-50 cursor-not-allowed',
        error && 'border-red-500 bg-red-500/5',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={acceptedTypes?.join(',')}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className={cn(
          'w-8 h-8',
          isDragActive ? 'text-blue-500' : 'text-[var(--text-muted)]'
        )} />
        <div className="text-sm">
          {isDragActive ? (
            <span className="text-blue-500 font-medium">Drop file here</span>
          ) : (
            <>
              <span className="font-medium text-blue-500">Click to upload</span>
              <span className="text-[var(--text-muted)]"> or drag and drop</span>
            </>
          )}
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Max size: {maxSizeMb}MB
        </div>
        {error && (
          <div className="text-xs text-red-500 mt-1">{error}</div>
        )}
      </div>
    </div>
  );
}
