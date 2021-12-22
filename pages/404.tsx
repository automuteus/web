import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Layout from "../components/layouts/MainLayout";

const ErrorPage = () => (
  <Layout title="404 Page Not Found" theatric>
    <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
      <div className="typewriter text-center">
        <div className="jumbo-text delay-in">404</div>
        <h1>
          This page was an imposter. <br />
        </h1>
        <Link href="/">
          <button className="btn btn-primary delay-in">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Go Home
          </button>
        </Link>
      </div>
    </div>
  </Layout>
);

export default ErrorPage;
