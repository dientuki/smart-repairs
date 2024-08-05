import { useOrderStore } from "@/store/OrderStore";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";

type Props = {
  orderId: string
}
function FileUpload({ orderId }: Props) {
  const { uploadAttachment } = useOrderStore();
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      console.log(orderId, selectedFile)

      try {
        const response = await uploadAttachment(orderId, selectedFile);
        console.log('Upload response:', response);
      } catch (error) {
          console.error('Error uploading file:', error);
      }

    }
  };


  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudArrowUpIcon />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
  </div>
  )
}

export default FileUpload
