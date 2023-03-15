import Image from "next/image";
import { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { supabase } from "../lib/supabaseClient";
import { Shop } from "../lib/types";
import { FaSpinner } from "react-icons/fa";

interface ShopCoverImageProps {
  url: Shop["cover_image"];
  onUpload: (filePath: string) => Promise<void>;
}

const ShopCoverImage: React.FC<ShopCoverImageProps> = ({ url, onUpload }) => {
  const [imageUrl, setImageUrl] = useState<Shop["cover_image"]>(url);
  const [uploading, setUploading] = useState(false);

  const getImagePublicUrl = (image_url: string) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(image_url);
    return publicUrl;
  };

  useEffect(() => {
    if (url) {
      setImageUrl(url);
    }
  }, [url]);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const publicUrl = getImagePublicUrl(filePath);
      setImageUrl(publicUrl);
      await onUpload(publicUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label
      htmlFor="dropzone-file"
      className="relative flex aspect-[2] h-full w-full cursor-pointer flex-col items-center justify-center"
    >
      {uploading ? (
        <div className="flex h-full items-center">
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading</span>
        </div>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt="Avatar"
          className="rounded-lg object-cover"
          layout="fill"
        />
      ) : (
        <div className="dark:hover:bg-bray-800 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <IoImageOutline className="mb-3 h-10 w-10 text-gray-600 dark:text-gray-400" />
          <p className="mb-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
            Upload an image here
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            or click to browse for a file
          </p>
        </div>
      )}
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
      />
    </label>
  );
};

export default ShopCoverImage;
