import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TaskProvider } from './service/task/TaskProvider.tsx';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ColumnProvider } from './service/column/ColumnProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DndProvider backend={HTML5Backend}>
            <ColumnProvider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </ColumnProvider>
        </DndProvider>
    </StrictMode>,
);
