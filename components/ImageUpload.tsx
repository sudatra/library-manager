'use client'

import React, { useRef, useState } from 'react'
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from '@/lib/config';
import Image from 'next/image';
import { toast } from 'sonner';

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

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
  const [file, setFile] = useState<{ filePath: string } | null>(null)
  const ikUploadRef = useRef(null);

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

    toast("Image uploaded successfully");
  };

  const onError = (error: any) => {
    console.log(error);
    toast("Image upload failed. Please try again");
  };

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
        fileName='text=upload.png'
      />

      <button 
        className='upload-btn bg-dark-300'
        onClick={(e) => uploadFile(e)}
      >
        <Image 
          src='/icons/upload.svg'
          alt='upload-icon'
          width={20}
          height={20}
          className='object-contain'
        />

        <p className='text-base text-light-100'>Upload a file</p>
      </button>
      
      <div className='flex flex-col gap-2 justify-center items-center'>
        {
          file && (
            <p className='upload-filename'>{file.filePath}</p>
          )
        }

        {
          file && (
            <IKImage 
              path={file.filePath}
              alt={file.filePath}
              width={500}
              height={300}
            />
          )
        }
      </div>
    </ImageKitProvider>
  )
}

export default ImageUpload
