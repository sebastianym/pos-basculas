import { Avatar } from '@nextui-org/react';
import React from 'react';

const CustomAvatar = ({ name: name }: { name: string }) => {
    const initial = name.charAt(0).toUpperCase();
    return (
        <Avatar size="sm" className='text-white' name={initial} style={{ backgroundColor: '#1c6b96' }} />
    );
};

export default CustomAvatar;