import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Calculator } from 'lucide-react';

const UNITS = {
  "Sq Ft": 1,
  "Acre": 43560,
  "Hectare": 107639.104,
  "Kanal": 5445,
  "Marla": 272.25,
  "Cent": 435.6,
  "Ground": 2400,
  "Guntha": 1089,
  "Sq Yard (Gaj)": 9,
  "Sq Meter": 10.7639
};

export default function UnitConverter({ onClose }) {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('Acre');
  const [toUnit, setToUnit] = useState('Sq Ft');
  const [result, setResult] = useState('');

  useEffect(() => {
    calculateConversion();
  }, [value, fromUnit, toUnit]);

  const calculateConversion = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult('0');
      return;
    }
    
    // Convert from unit to base unit (Sq Ft)
    const inSqFt = num * UNITS[fromUnit];
    
    // Convert base unit to target unit
    const finalVal = inSqFt / UNITS[toUnit];
    
    // Format to 2 decimal places if needed, but avoid trailing zeros
    setResult(parseFloat(finalVal.toFixed(4)).toString());
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'rgba(20, 15, 35, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', width: '90%', maxWidth: '450px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, marginBottom: '1.5rem', fontSize: '1.4rem' }}>
          <Calculator color="#a855f7" /> Land Unit Converter
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount</label>
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '1.1rem', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>From Unit</label>
              <select 
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                }}
              >
                {Object.keys(UNITS).map(u => <option key={u} value={u} style={{ color: '#000' }}>{u}</option>)}
              </select>
            </div>

            <button 
              onClick={handleSwap}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginTop: '26px'
              }}
            >
              <ArrowRightLeft size={18} />
            </button>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>To Unit</label>
              <select 
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                }}
              >
                {Object.keys(UNITS).map(u => <option key={u} value={u} style={{ color: '#000' }}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 100%)',
            border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            marginTop: '0.5rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Result</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              {result} <span style={{ fontSize: '1.2rem', color: '#a855f7', fontWeight: 500 }}>{toUnit}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
