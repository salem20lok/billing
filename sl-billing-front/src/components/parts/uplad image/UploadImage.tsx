import axios from "axios";
import "cropperjs/dist/cropper.css";
import { useRef, useState } from "react";
import { Cropper } from "react-cropper";

interface UploadImageInterface {
  avatar: string;
  uploadAvatar: Function;
}

const UploadImage = (props: UploadImageInterface) => {
  const { uploadAvatar, avatar } = props;

  const [showProp, setShowProp] = useState<boolean>(false);
  const [cropper, setCropper] = useState<any>();
  const [image, setImage] = useState("");

  const cropperRef = useRef<HTMLImageElement>(null);

  const handleCloseModalCrop = () => {
    setShowProp(false);
  };

  // upload api
  const handleUpload = (file: Blob, mimeString: string) => {
    const extension = mimeString.slice(mimeString.indexOf("/") + 1);
    const formData = new FormData();
    formData.append("image", file, `image.${extension}`);
    axios
      .post(process.env.REACT_APP_API_URL + "/uploads", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then(({ data }) => {
        uploadAvatar(data.url);
      })
      .catch((e) => {
        console.log(e.response.data.message);
      });
  };

  // transform image form data to image render
  const handleShowModalCrop = (files: FileList | null) => {
    if (files === null) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };

    reader.readAsDataURL(files[0]);
    setShowProp(true);
  };

  // transform image path to formData
  const getCropData = () => {
    const dataURI = cropper.getCroppedCanvas().toDataURL();
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    handleUpload(new Blob([ia], { type: mimeString }), mimeString);
    handleCloseModalCrop();
  };

  return (
    <>
      {showProp && (
        <>
          <div
            onClick={() => handleCloseModalCrop()}
            id="popup-modal"
            tabIndex={-1}
            className="fixed w-full h-full  top-0 left-0 bg-black bg-opacity-0 overflow-y-auto fixed z-30 md:inset-0 h-modal md:h-full"
          />

          <div
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
            className="absolute z-50 p-4 w-3/4 max-w-2xl h-3/4 md:h-auto  "
          >
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow bg-gray-900">
              {/* Modal header */}
              <div className="flex justify-between items-start p-4 rounded-t  dark:border-gray-600">
                <button
                  onClick={() => handleCloseModalCrop()}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="defaultModal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-6 space-y-6 h-60 ">
                <Cropper
                  src={image}
                  // Cropper.js options
                  style={{ height: "100%", width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  guides={false}
                  viewMode={1}
                  checkOrientation={false}
                  ref={cropperRef}
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                />
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-6 space-x-2 rounded-b dark:border-gray-600 justify-end ">
                <button
                  onClick={() => handleCloseModalCrop()}
                  data-modal-toggle="defaultModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    getCropData();
                  }}
                  data-modal-toggle="defaultModal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="relative z-0 mb-6 w-full group   ">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center justify-center w-16 h-16 mx-2 overflow-hidden rounded-full">
            <img src={avatar} alt="avatar" />
          </div>
          <label className="cursor-pointer ">
            <span className="inline-flex items-center h-10 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Browse
            </span>
            <input
              onChange={(e) => {
                handleShowModalCrop(e.target.files);
                //setShowProp(true);
                // handleUpload(e.target.files);
              }}
              type="file"
              className="hidden"
              multiple
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default UploadImage;
