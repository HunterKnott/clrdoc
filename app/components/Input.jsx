// app/components/Input.js
'use client';

import React from 'react';

export default function Input({ id, label, type, value, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label && label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="border-gray-400 border-2 rounded p-3 md:text-xl w-full"
        required
      />
    </div>
  );
};
