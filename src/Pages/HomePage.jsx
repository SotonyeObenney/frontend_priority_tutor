import { useEffect } from "react";
import { apiFetch } from "../api";

const HomePage = () => {
  useEffect(() => {
    async function LoadHome() {
      try {
        const result = await apiFetch("");
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  });
  return <div>HomePage</div>;
};

export default HomePage;
