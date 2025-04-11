import { Fab } from '@mui/material';

interface Props {
    onClick: () => void;
}

const CreateTaskButton = ({ onClick }: Props) => {
    return (
        <Fab
            color="primary"
            className="fixed bottom-6 right-6"
            onClick={onClick}
        >
            +
        </Fab>
    );
};

export default CreateTaskButton;
