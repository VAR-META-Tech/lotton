import React from 'react';

import { FAQ_DATA } from '../utils/const';
import FaqItem from './FaqItem';

const FaqContent = () => {
  return (
    <div>
      <div className="border-b border-gray-color">
        <h2 className="text-base font-bold py-2 mx-2 container">FAQ</h2>
      </div>

      {FAQ_DATA?.map((item, index) => (
        <FaqItem key={index} value={item?.value} title={item?.title} content={item?.content} />
      ))}
    </div>
  );
};

export default FaqContent;
