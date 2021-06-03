import { Spinner } from "react-bootstrap";
import MainLayout from "./MainLayout";

const LoadingLayout = () => {
  return (
    <MainLayout>
      <div className="container pb-4 d-flex flex-grow-1 flex-column align-items-center justify-content-center">
        <Spinner
          animation="border"
          style={{ width: "7.5rem", height: "7.5rem", borderWidth: "0.75rem" }}
        />
        <h3 className="mt-3">Loading...</h3>
      </div>
    </MainLayout>
  );
};

export default LoadingLayout;
