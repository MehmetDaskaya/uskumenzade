import { Suspense } from "react";
import ResetPasswordClient from "./ResetPassWordClient";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
