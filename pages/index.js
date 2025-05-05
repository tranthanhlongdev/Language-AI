import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the frontend URL
    window.location.href = "http://localhost:3001";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Language Learning App API</h1>
      <p>Redirecting to the frontend application...</p>
      <p>
        If you are not redirected,{" "}
        <a href="http://localhost:3001">click here</a>.
      </p>
    </div>
  );
}
