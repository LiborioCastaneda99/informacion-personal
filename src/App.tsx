import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface FormData {
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  estadoCivil: string;
  ocupacion: string;
}

function App() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "",
    estadoCivil: "",
    ocupacion: "",
  });

  const [data, setData] = useState<FormData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("registros");
    if (stored) setData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(data));
  }, [data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setData([...data, form]);
    setForm({
      nombre: "",
      apellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      genero: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      pais: "",
      estadoCivil: "",
      ocupacion: "",
    });
  };

  /**
   * Handle the deletion of a record from the data array.
   * @param {number} index - The index of the record to be deleted.
   */
  const handleDelete = (index: number) => {
    // Filter out the record at the given index from the data array.
    setData(data.filter((_, i) => i !== index));
  };

  const inputClass = "input w-full"; // aplica la clase .input de tu CSS

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-black mb-10 text-center">
          Registro de Información Personal
        </h1>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className={inputClass}
            required
          />
          <input
            type="text"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            className={inputClass}
            required
          />
          <select
            name="tipoDocumento"
            value={form.tipoDocumento}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Tipo de Documento</option>
            <option value="CC">Cédula</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PAS">Pasaporte</option>
          </select>
          <input
            type="text"
            name="numeroDocumento"
            value={form.numeroDocumento}
            onChange={handleChange}
            placeholder="Número de Documento"
            className={inputClass}
            required
          />
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={inputClass}
            required
          />
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className={inputClass}
            required
          />
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            className={inputClass}
            required
          />
          <input
            type="text"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
            className={inputClass}
            required
          />
          <input
            type="text"
            name="pais"
            value={form.pais}
            onChange={handleChange}
            placeholder="País"
            className={inputClass}
            required
          />
          <select
            name="estadoCivil"
            value={form.estadoCivil}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Estado Civil</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Unión Libre">Unión Libre</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </select>
          <input
            type="text"
            name="ocupacion"
            value={form.ocupacion}
            onChange={handleChange}
            placeholder="Ocupación"
            className={inputClass}
          />

          <div className="md:col-span-2 flex justify-center mt-6">
            <button className="button bg-blue-600 text-white px-10 py-4 rounded-3xl hover:bg-blue-700 font-bold text-lg transition shadow-lg hover:shadow-xl">
              Guardar
            </button>
          </div>
        </form>

        {/* Cards de datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, i) => (
            <div key={i} className="card">
              <button
                onClick={() => handleDelete(i)}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                ×
              </button>
              <h3 className="text-2xl font-bold mb-2">
                {item.nombre} {item.apellidos}
              </h3>
              <p>
                <span className="font-semibold">Documento:</span>{" "}
                {item.tipoDocumento} {item.numeroDocumento}
              </p>
              <p>
                <span className="font-semibold">Fecha Nac.:</span>{" "}
                {item.fechaNacimiento}
              </p>
              <p>
                <span className="font-semibold">Género:</span> {item.genero}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {item.email}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span> {item.telefono}
              </p>
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {item.direccion}, {item.ciudad}, {item.pais}
              </p>
              <p>
                <span className="font-semibold">Estado Civil:</span>{" "}
                {item.estadoCivil}
              </p>
              <p>
                <span className="font-semibold">Ocupación:</span>{" "}
                {item.ocupacion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
