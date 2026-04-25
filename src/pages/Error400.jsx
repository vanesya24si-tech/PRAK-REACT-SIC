import ErrorPage from "../components/ErrorPage";

export default function Error401() {
  return (
    <ErrorPage
      code={400}
      description="Unauthorized"
      image="/img/404.jpg"
    />
  );
}