'use client'

import React, { useRef, useState } from 'react'
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from '@/lib/config';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { token, expire, signature };
  }
  catch(error: any) {
    throw new Error(`Authentication Request failed: ${error.message}`)
  }
}

interface Props {
  onFileChange: (filePath: string) => void;
  accept: string;
  type: 'image' | 'video';
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
}

const FileUpload = ({ type, accept, placeholder, folder, variant, onFileChange }: Props) => {
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const ikUploadRef = useRef(null);

  const styles = {
    button: variant === 'dark' ? 'bg-dark-300': 'bg-light-600 border border-gray-100',
    placeholder: variant === 'dark' ? 'text-light-100': 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100': 'text-dark-400'
  }

  const uploadFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if(ikUploadRef.current) {
      // @ts-ignore
      ikUploadRef.current?.click();
    }
  }

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast(`${type} uploaded successfully`);
  };

  const onError = (error: any) => {
    console.log(error);
    toast(`${type} upload failed. Please try again`);
  };

  const onValidate = (file: File) => {
    if(type === 'image') {
      if(file.size > 20 * 1024 * 1024) {
        toast("File size too large");
        return false;
      }
    }
    else if(type === 'video') {
      if(file.size > 50 * 1024 * 1024) {
        toast("File size too large");
        return false;
      }
    }

    return true;
  }

  return (
    <ImageKitProvider
      publicKey={config.env.imageKit.publicKey}
      urlEndpoint={config.env.imageKit.urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload 
        className='hidden'
        ref={ikUploadRef}
        onSuccess={onSuccess}
        onError={onError}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percentage = Math.round((loaded / total) * 100);
          setProgress(percentage)
        }}
        folder={folder}
        accept={accept}
      />

      <button 
        className={cn(
          'upload-btn bg-dark-300',
          styles.button
        )}
        onClick={(e) => uploadFile(e)}
      >
        <Image 
          src='/icons/upload.svg'
          alt='upload-icon'
          width={20}
          height={20}
          className='object-contain'
        />

        <p className={cn('text-base text-light-100', styles.placeholder)}>{placeholder}</p>
        {
          file && (
            <p className={cn('upload-filename', styles.text)}>{file.filePath}</p>
          )
        }
      </button>

      {
        progress > 0 && progress !== 100 && (
          <div className='w-full rounded-full bg-green-200'>
            <div 
              className='progress'
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )
      }

      {
        file && (
          (
            type === 'image' ? (
              <IKImage 
                path={file.filePath}
                alt={file.filePath}
                width={500}
                height={300}
              />
            ) : type === 'video' ? (
              <IKVideo 
                path={file.filePath}
                controls={true}
                className='h-96 rounded-xl w-full'
              />
            ) : null
          )
        )
      }
    </ImageKitProvider>
  )
}

export default FileUpload
