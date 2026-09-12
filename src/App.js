import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir icono por defecto de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Función para crear iconos personalizados con emojis según la categoría
const crearIconoEmoji = (emoji) => {
  return L.divIcon({
    className: 'custom-emoji-marker',
    html: `<div style="background: white; border: 2px solid #0f172a; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

const iconosCategorias = {
  basuras: crearIconoEmoji('🗑️'),
  vias: crearIconoEmoji('⚠️'),
  alumbrado: crearIconoEmoji('💡'),
  drenaje: crearIconoEmoji('🌧️'),
  ideas: crearIconoEmoji('💡'),
};

// Componente auxiliar para capturar clics en el mapa
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function App() {
  // Inicializamos desde cero (arreglo vacío o cargado de localStorage)
  const [reportes, setReportes] = useState(() => {
    const guardados = localStorage.getItem('monteria_reportes');
    return guardados ? JSON.parse(guardados) : [];
  });

  const [filtro, setFiltro] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const [form, setForm] = useState({ cat: 'basuras', barrio: '', desc: '' });

  // Guardar en localStorage cada vez que cambien los reportes
  useEffect(() => {
    localStorage.setItem('monteria_reportes', JSON.stringify(reportes));
  }, [reportes]);

  // Estadísticas reales calculadas desde cero
  const totalReportes = reportes.length;
  const totalConversaciones = reportes.reduce(
    (acc, r) => acc + r.reportes + 2,
    0
  );
  const totalParticipantes = reportes.length * 2; // Simulado dinámico según participación

  const reportesFiltrados =
    filtro === 'todos' ? reportes : reportes.filter((r) => r.cat === filtro);

  // Manejar clic en el mapa
  const handleMapClick = (latlng) => {
    setUbicacionSeleccionada(latlng);
    setForm({ cat: 'basuras', barrio: '', desc: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoReporte = {
      id: Date.now(), // ID único basado en tiempo
      lat: ubicacionSeleccionada ? ubicacionSeleccionada.lat : 8.755,
      lng: ubicacionSeleccionada ? ubicacionSeleccionada.lng : -75.881,
      cat: form.cat,
      title: form.desc,
      barrio: form.barrio,
      reportes: 1,
      estado: '🔴 Reportado',
    };

    setReportes([nuevoReporte, ...reportes]);
    setIsModalOpen(false);
    setUbicacionSeleccionada(null);
    setForm({ cat: 'basuras', barrio: '', desc: '' });
    alert('¡Reporte publicado con éxito en el mapa interactivo de Montería!');
  };

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#0d1b2a',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Montería Puede Más{' '}
          <span style={{ color: '#f59e0b' }}>/ El Mapa de Montería</span>
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.85rem',
              color: '#475569',
              background: '#f1f5f9',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              display: window.innerWidth > 768 ? 'block' : 'none',
            }}
          >
            💡 <i>Haz clic en cualquier punto del mapa para reportar</i>
          </span>
          <button
            onClick={() => {
              setUbicacionSeleccionada({ lat: 8.755, lng: -75.881 });
              setIsModalOpen(true);
            }}
            style={{
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            + Reportar Algo
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          padding: '1.5rem 2rem 1rem 2rem',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#0f172a',
            lineHeight: '1.2',
            margin: '0 0 0.4rem 0',
          }}
        >
          Lo que vemos.{' '}
          <span style={{ color: '#f59e0b' }}>Lo que vivimos.</span> Lo que
          podemos mejorar.
        </h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
          Plataforma ciudadana abierta para la georreferenciación de
          problemáticas y propuestas.
        </p>
      </section>

      {/* Stats desde Cero */}
      <div
        style={{
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto 1rem auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>📊</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              {totalConversaciones}
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Interacciones
            </p>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>📍</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              {totalReportes}
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Reportes en el Mapa
            </p>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              {reportes.filter((r) => r.cat === 'ideas').length}
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Ideas Propuestas
            </p>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>👥</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              {totalParticipantes}
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Ciudadanos Activos
            </p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div
        style={{
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto 2rem auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '1.5rem',
          flex: 1,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: '#fff',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            height: 'fit-content',
          }}
        >
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Filtrar por Tema
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
          >
            {[
              { id: 'todos', label: '🌐 Todos los temas' },
              { id: 'basuras', label: '🗑️ Basuras' },
              { id: 'vias', label: '⚠️ Vías y huecos' },
              { id: 'alumbrado', label: '💡 Alumbrado' },
              { id: 'drenaje', label: '🌧️ Drenaje' },
              { id: 'ideas', label: '💡 Ideas y propuestas' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFiltro(item.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: filtro === item.id ? '#eff6ff' : '#f8fafc',
                  color: filtro === item.id ? '#2563eb' : '#334155',
                  fontWeight: filtro === item.id ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            minHeight: '500px',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <MapContainer
            center={[8.755, -75.881]}
            zoom={14}
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onMapClick={handleMapClick} />

            {reportesFiltrados.map((item) => (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={iconosCategorias[item.cat] || iconosCategorias.basuras}
              >
                <Popup>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      padding: '2px',
                      maxWidth: '210px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        background: '#e2e8f0',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        color: '#334155',
                      }}
                    >
                      {item.barrio}
                    </span>
                    <h4
                      style={{
                        margin: '6px 0 3px 0',
                        fontSize: '13px',
                        color: '#0f172a',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                      }}
                    >
                      Estado: <b>{item.estado}</b>
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#0284c7',
                        margin: '0 0 8px 0',
                        fontWeight: '600',
                      }}
                    >
                      {item.reportes} apoyo(s) ciudadano(s)
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <button
                        onClick={() => {
                          const actualizados = reportes.map((r) =>
                            r.id === item.id
                              ? { ...r, reportes: r.reportes + 1 }
                              : r
                          );
                          setReportes(actualizados);
                          alert('¡Apoyo sumado correctamente!');
                        }}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        A mí también me pasa
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Modal Reporte */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '450px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.2rem',
                color: '#0f172a',
              }}
            >
              📍 Nuevo Reporte Georreferenciado
            </h3>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                marginBottom: '1rem',
              }}
            >
              Coordenadas:{' '}
              {ubicacionSeleccionada
                ? `${ubicacionSeleccionada.lat.toFixed(
                    4
                  )}, ${ubicacionSeleccionada.lng.toFixed(4)}`
                : 'N/A'}
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.3rem',
                    color: '#475569',
                  }}
                >
                  Categoría
                </label>
                <select
                  value={form.cat}
                  onChange={(e) => setForm({ ...form, cat: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="basuras">🗑️ Basuras acumuladas</option>
                  <option value="vias">⚠️ Vías y huecos</option>
                  <option value="alumbrado">💡 Problema de alumbrado</option>
                  <option value="drenaje">🌧️ Inundación / Drenaje</option>
                  <option value="ideas">💡 Tengo una idea / Propuesta</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.3rem',
                    color: '#475569',
                  }}
                >
                  Barrio / Sector
                </label>
                <input
                  type="text"
                  placeholder="Ej: La Granja, Centro, El Recreo, Mocarí..."
                  value={form.barrio}
                  onChange={(e) => setForm({ ...form, barrio: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.3rem',
                    color: '#475569',
                  }}
                >
                  Descripción
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe brevemente el problema..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                ></textarea>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#334155',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
