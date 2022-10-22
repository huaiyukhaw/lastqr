import clsx from "clsx";
import Image from "next/image";

export const Footer: React.FC = () => (
  <div className="fixed inset-x-0 bottom-3 mt-8 flex justify-center gap-1">
    <a
      href="#"
      className={clsx(
        "group",
        "flex items-center gap-2 rounded-lg p-3 py-1.5 text-sm font-medium drop-shadow",
        "border border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-transparent dark:bg-black dark:hover:bg-black"
      )}
    >
      <Image src="/logo.png" alt="LastQR logo" width={16} height={16} />
      <span>
        Made in <span className="dark:group-hover:text-primary">Last</span>
        <span className="dark:group-hover:text-secondary">QR</span>
      </span>
    </a>
  </div>
);
