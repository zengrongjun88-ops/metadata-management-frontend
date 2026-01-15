import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TableList from '../pages/TableList';
import TableDetail from '../pages/TableDetail';
import TableCreate from '../pages/TableCreate';
import TableEdit from '../pages/TableEdit';
import ApprovalList from '../pages/ApprovalList';
import OperationHistory from '../pages/OperationHistory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/tables" replace />,
      },
      {
        path: 'tables',
        element: <TableList />,
      },
      {
        path: 'tables/detail/:id',
        element: <TableDetail />,
      },
      {
        path: 'tables/create',
        element: <TableCreate />,
      },
      {
        path: 'tables/edit/:id',
        element: <TableEdit />,
      },
      {
        path: 'approvals',
        element: <ApprovalList />,
      },
      {
        path: 'history',
        element: <OperationHistory />,
      },
    ],
  },
]);

export default router;
