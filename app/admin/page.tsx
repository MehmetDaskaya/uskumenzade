import AdminPanel from "../components/AdminPanel/AdminPanel";
import { Footer, Navbar } from "../../app/components/index";

export default function AdminPage() {
  return (
    <div>
      <Navbar viewable={false} />
      <AdminPanel />
      <Footer viewable={false} />
    </div>
  );
}
