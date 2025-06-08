import { useNotifications } from "@toolpad/core/useNotifications";
import { Navigate } from "react-router-dom";

const StartingServer = () => {
  const notifications = useNotifications();
  notifications.show("Iniciando el servidor, esto puede tomar unos segundos...", {severity: "info", autoHideDuration: 6000});
    return (
    <Navigate to="freidora-de-aire-oster-6lts-digital-diamondforce" replace />
  );
};

export default StartingServer;
