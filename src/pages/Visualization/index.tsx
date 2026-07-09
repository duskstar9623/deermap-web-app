import { Outlet, useOutletContext } from 'react-router-dom';

/**
 * Visualization module layout.
 * Forwards parent outlet context so child pages can access setPage().
 */
function VisualizationLayout() {
  const context = useOutletContext();
  return <Outlet context={context} />;
}

export default VisualizationLayout;
