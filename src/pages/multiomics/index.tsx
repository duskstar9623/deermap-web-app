import { Outlet, useOutletContext } from 'react-router-dom'

/**
 * Multiomics module layout.
 * Forwards parent outlet context so child pages can access setPage().
 */
function MultiomicsLayout() {
  const context = useOutletContext()
  return <Outlet context={context} />
}

export default MultiomicsLayout
