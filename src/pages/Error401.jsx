import ErrorPage from "../components/ErrorPage";

export default function Error401() {
  return (
    <ErrorPage
      code={401}
      description="Unauthorized"
      image="/img/404.jpg"
    />
  );
}