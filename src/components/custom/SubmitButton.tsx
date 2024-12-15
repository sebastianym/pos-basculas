"use client";
import { useFormStatus } from "react-dom";
import { LuLoaderCircle } from "react-icons/lu";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  size: string;
  controlled?: boolean;
  className?: string;
  loading?: boolean;
  color: string;
}

const colorSelected = (color: string) => {
  if (color == 'pink') return 'bg-pink-500 border-pink-500 text-white hover:bg-pink-400 hover:border-pink-400 disabled:bg-pink-500 disabled:border-pink-500 focus-visible:ring-pink-600';
  if (color == 'green') return 'bg-green-500 border-green-500 text-white hover:bg-green-400 hover:border-green-400 disabled:bg-green-500 disabled:border-green-500 focus-visible:ring-green-600';
  if (color == 'blue') return 'bg-blue-500 border-blue-500 text-white hover:bg-blue-400 hover:border-blue-400 disabled:bg-blue-500 disabled:border-blue-500 focus-visible:ring-blue-600';
  if (color == 'red') return 'bg-red-500 border-red-500 text-white hover:bg-red-400 hover:border-red-400 disabled:bg-red-500 disabled:border-red-500 focus-visible:ring-red-600';
}

const sizeSelected = (size: string) => {
  if (size == 'small') return 'px-3 py-2';
  if (size == 'medium') return 'h-[40px] text-sm px-5 py-2';
  if (size == 'large') return 'h-[50px] text-base py-2 px-3';
}

export function SubmitButton({ text, loadingText, size, loading, color, className, controlled }: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading || controlled}
      className={`group/button ${colorSelected(color)} ${sizeSelected(size)} ${className} transition-all flex items-center justify-center border transform  duration-50 active:scale-95 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md leading-6 space-x-3`}
    >
      {status.pending || loading ? <Loader text={loadingText} /> : text}
    </button>
  );
}