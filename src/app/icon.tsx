import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 55%, #0891b2 100%)",
          color: "white",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 30,
        }}
      >
        IS
      </div>
    ),
    { ...size },
  );
}
