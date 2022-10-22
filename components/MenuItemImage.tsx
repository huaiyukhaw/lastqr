import Image from "next/image";
import { useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { supabase } from "../lib/supabaseClient";
import { MenuItem } from "../lib/types";

interface MenuItemImageProps {
  url: MenuItem["image_url"];
  onUpload: (filePath: string) => Promise<void>;
}

const MenuItemImage: React.FC<MenuItemImageProps> = ({ url, onUpload }) => {
  const [imageUrl, setImageUrl] = useState<MenuItem["image_url"]>(url);
  const [uploading, setUploading] = useState(false);

  const getImagePublicUrl = (image_url: string) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(image_url);
    return publicUrl;
  };

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `items/${fileName}`;

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
      className="flex w-full cursor-pointer flex-col items-center justify-center"
    >
      {uploading ? (
        <div className="aspect-ratio dark:hover:bg-bray-800 flex h-44 w-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          Uploading...
        </div>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt="Avatar"
          className="rounded-lg object-cover"
          height={176}
          width={176}
        />
      ) : (
        <div className="aspect-ratio dark:hover:bg-bray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <IoImageOutline className="mb-3 h-10 w-10 text-gray-600 dark:text-gray-400" />
          <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Upload an image here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
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

export default MenuItemImage;
