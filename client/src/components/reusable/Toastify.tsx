import { Bounce, ToastContainer } from 'react-toastify';

// i need a toast after all this

function Toastify() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      hideProgressBar={false}
      theme="light"
      transition={Bounce}
      toastStyle={{
        background: "#ffffff",
        color: "#2b2b2b",
        borderRadius: "18px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        padding: "14px 16px",
        fontSize: "14px",
        fontWeight: "500",
      }}
    />
  )
}

export default Toastify;