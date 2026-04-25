import { Link } from "react-router-dom";

export default function ErrorPage({ code, description, image }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <img src={image} alt="error" className="w-72 mb-6" />
      <h1 className="text-6xl font-bold text-blue-600">{code}</h1>
      <p className="mt-4 text-xl">{description}</p>

      <Link to="/" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}