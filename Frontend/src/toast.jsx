import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

window.toast = toast;

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
