import React from 'react';
import { BsJoystick } from 'react-icons/bs';
import { IoMdAirplane } from 'react-icons/io';

const AirCraftType = ({ type: type, size: size, format: format }: { type: string, size: number, format: string }) => {

    if (type === 'AIRCRAFT') {
        return (
            <IoMdAirplane className={`bg-green-200 text-white rounded-md ${format === 'ACCORDION' ? 'p-4 mr-3' : 'p-2'}`} size={size}/>
        );
    }

    if (type === 'SIMULATOR') {
        return (
            <BsJoystick className={`bg-blue-200 text-white rounded-md ${format === 'ACCORDION' ? 'p-4 mr-3' : 'p-2'}`} size={size}/>
        );
    }

};

export default AirCraftType;