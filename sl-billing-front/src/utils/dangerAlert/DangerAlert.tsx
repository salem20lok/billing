export interface DangerAlertProps {
  handleCloseAlert: Function;
  msg: string;
}

const DangerAlert = (props: DangerAlertProps) => {
  const { msg, handleCloseAlert } = props;

  return (
    <div
      style={{ zIndex: 10000 }}
      className="flex w-96 shadow-lg rounded-lg fixed top-2 right-0 "
    >
      <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center ">
        <svg
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current text-white"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
          />
        </svg>
      </div>
      <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
        <div>{msg}</div>
        <button onClick={() => handleCloseAlert()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-700"
            viewBox="0 0 16 16"
            width="20"
            height="20"
          >
            <path
              fillRule="evenodd"
              d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DangerAlert;
