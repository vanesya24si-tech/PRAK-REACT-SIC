export default function ErrorPage({ code, message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      <h1 className="text-9xl font-bold text-pink-500">{code}</h1>
      <p className="text-2xl text-gray-600 mt-4">{message}</p>
      <a href="/" className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-lg">Kembali ke Dashboard</a>
    </div>
  );
}