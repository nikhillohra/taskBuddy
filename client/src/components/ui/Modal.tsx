import React, { useEffect, useRef } from "react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  position?: { top: number; left: number };
};

const Modal: React.FC<ModalProps> = ({ onClose, children, position }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={`z-50 ${position ? "absolute" : "fixed inset-0 flex items-center text-sm justify-center"}`}
      style={position ? { top: position.top, left: position.left } : {}}
    >
      <div
        ref={modalRef}
        className="bg-[#FFF9F9] border-[#7B198426] text-sm z-10 text-center rounded-xl shadow-lg shadow-[#7B19841F] w-[10rem]  relative"
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
