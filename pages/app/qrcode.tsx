import { useEffect } from "react";
import { NextPage } from "next";
import AppLayout from "../../components/AppLayout";
import Head from "next/head";
import { useShop } from "../../context/shopContext";
import { useState } from "react";
import clsx from "clsx";
import { getSVG } from "@shortcm/qr-image/lib/svg";
import { getPNG } from "@shortcm/qr-image/lib/png";
import { getPDF } from "@shortcm/qr-image/lib/pdf";
import Image from "next/image";
import { Qr, QrFormats, QrUrls } from "../../lib/types";
import { baseDomain } from "../../lib/constants";

const QrCodePage: NextPage = () => {
  let qrCodes: Qr[] = [
    {
      id: "1",
      title: "Download PNG",
      description: "Ideal for social media.",
      dimension: "248 x 248 px",
      format: "image/png",
    },
    {
      id: "2",
      title: "Download SVG",
      description: "Ideal for websites.",
      dimension: "",
      format: "image/svg+xml",
    },
    {
      id: "3",
      title: "Download PDF",
      description: "Ideal for printing.",
      dimension: "",
      format: "application/pdf",
    },
  ];

  const { shop } = useShop();
  const [selectedQr, setSelectedQr] = useState<Qr>(qrCodes[0]);
  const [qrUrls, setQrUrls] = useState<QrUrls | null>(null);

  useEffect(() => {
    const getQrUrls = async () => {
      const shopUrl = `https://${baseDomain}/m/${shop.username}`;

      const options = {
        color: 0x000000ff,
        bgColor: 0xffffffff,
        size: 8,
        margin: 1,
      };
      let buffer;
      let urls = {} as QrUrls;
      for (const format in QrFormats) {
        if (format === "image/svg+xml") {
          buffer = await getSVG(shopUrl, options);
        } else if (format === "application/pdf") {
          buffer = await getPDF(shopUrl, options);
        } else {
          buffer = await getPNG(shopUrl, options);
        }
        const blob = new Blob([buffer], { type: format });
        const url = URL.createObjectURL(blob!);

        urls[format as QrFormats] = url;
      }

      setQrUrls(urls);
    };

    if (shop) {
      getQrUrls();
    }
  }, [shop]);

  const downloadQrCode = async () => {
    const link = document.createElement("a");
    if (qrUrls) {
      link.href = qrUrls[selectedQr.format] ?? "#";
      link.download = "QR-" + shop.name?.toLowerCase().replace(" ", "-");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Head>
        <title>Download the QR - LastQR</title>
        <meta name="description" content="Create menus QR using LastQR" />
      </Head>
      <AppLayout>
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <h1 className="mt-8 mb-4 text-2xl font-medium">QR code</h1>
          </div>
          <div className="mt-6 flex flex-col gap-5 md:flex-row">
            <div className="flex-1 rounded-lg bg-white p-6 drop-shadow dark:bg-gray-800">
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-medium">Download the QR</h1>
                <ul className="flex flex-col gap-2">
                  {qrCodes.map((qr) => (
                    <li key={qr.id}>
                      <button
                        type="button"
                        className={clsx(
                          "flex w-full items-center justify-between gap-2 rounded-md border px-5 py-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700",
                          selectedQr.id === qr.id
                            ? "border-transparent ring-2 ring-blue-500"
                            : "border-gray-200 dark:border-gray-700"
                        )}
                        onClick={() => setSelectedQr(qr)}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{qr.title}</div>
                          <div className="text-sm font-normal text-gray-800 dark:text-gray-300">
                            {qr.description}
                          </div>
                        </div>
                        <div className="flex-none text-right text-sm font-normal text-gray-800 dark:text-gray-300">
                          {qr.dimension}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end">
                  <button
                    className="flex w-fit items-center gap-x-1.5 rounded-md bg-blue-500 py-2 px-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={downloadQrCode}
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-none rounded-lg bg-white px-4 py-6 drop-shadow dark:bg-gray-800">
              <div className="flex flex-col items-center gap-4">
                <div className="qr-code flex-none">
                  {qrUrls &&
                    qrUrls["image/png"] &&
                    qrUrls["image/png"] !== "#" && (
                      <Image
                        src={qrUrls["image/png"]}
                        alt={"QR code"}
                        width={240}
                        height={240}
                      />
                    )}
                </div>
                <div>
                  <div className="text-center text-sm font-normal text-gray-800 dark:text-gray-300">
                    <span className="w-full whitespace-pre-line">
                      Scan the QR to see the menu or
                      <br />
                      click on this link:
                    </span>
                    <br />
                    <a
                      href={`https://${baseDomain}/m/${shop.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 decoration-2 hover:underline dark:text-blue-500"
                    >
                      {baseDomain}/m/{shop.username}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default QrCodePage;
