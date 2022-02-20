import MainLayout from "./MainLayout";

const ErrorLayout = () => {
  return (
    <MainLayout>
      <div className="container pb-4 d-flex flex-grow-1 flex-column align-items-center justify-content-center">
        <h2 className="bg-danger p-2">There's been some kind of error!</h2>
        <h6>Please report this on our Discord Support Server</h6>
      </div>
    </MainLayout>
  );
};

export default ErrorLayout;
