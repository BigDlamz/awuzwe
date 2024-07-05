'use client';

import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordStrength: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    if (!password) return null;  // Don't render anything if password is empty

    const testResult = zxcvbn(password);
    const num = testResult.score * 100/4;

    const createPasswordLabel = () => {
        switch (testResult.score) {
            case 0:
                return 'Very Weak';
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return 'None';
        }
    }

    const funcProgressColor = () => {
        switch(testResult.score) {
            case 0:
                return '#EA1111';
            case 1:
                return '#FFAD00';
            case 2:
                return '#FFAD01';
            case 3:
                return '#9bc158';
            case 4:
                return '#00b500';
            default:
                return 'none';
        }
    }

    const changePasswordColor = () => ({
        width: `${num}%`,
        background: funcProgressColor(),
        height: '7px'
    })

    return (
        <>
            <div className="progress" style={{ height: '7px' }}>
                <div className="progress-bar" style={changePasswordColor()}></div>
            </div>
            <p style={{ color: funcProgressColor() }}>{createPasswordLabel()}</p>
        </>
    )
}

export default PasswordStrength;