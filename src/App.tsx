/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { ConfigurationPage } from "./components/Configuration/ConfigurationPage";
import { Inicio } from "./components/Views/Inicio";
import { Conciliaciones } from "./components/Views/Conciliaciones";
import { Diferencias } from "./components/Views/Diferencias";
import { Aprobaciones } from "./components/Views/Aprobaciones";
import { Resultados } from "./components/Views/Resultados";
import { Auditoria } from "./components/Views/Auditoria";
import { Administracion } from "./components/Views/Administracion";

export type ViewType = 
  | 'inicio' 
  | 'conciliaciones' 
  | 'diferencias' 
  | 'aprobaciones' 
  | 'resultados' 
  | 'auditoria' 
  | 'configuracion'
  | 'administracion';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('inicio');

  const renderView = () => {
    switch (currentView) {
      case 'inicio': return <Inicio />;
      case 'conciliaciones': return <Conciliaciones onNavigate={setCurrentView} />;
      case 'diferencias': return <Diferencias />;
      case 'aprobaciones': return <Aprobaciones />;
      case 'resultados': return <Resultados />;
      case 'auditoria': return <Auditoria />;
      case 'configuracion': return <ConfigurationPage />;
      case 'administracion': return <Administracion />;
      default: return <Inicio />;
    }
  };

  return (
    <AppShell currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </AppShell>
  );
}
