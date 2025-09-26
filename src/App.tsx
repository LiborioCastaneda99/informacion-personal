import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

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
  deptSel: string;
  estadoCivil: string;
  ocupacion: string;
  name_departamento: string;
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
    deptSel: "",
    estadoCivil: "",
    ocupacion: "",
    name_departamento: "",
  });

  interface Departamento {
    id: number;
    name: string;
  }

  interface Municipio {
    id: number;
    name: string;
  }

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [deptSel, setDeptSel] = useState<string>("");

  useEffect(() => {
    fetch("https://api-colombia.com/api/v1/Department")
      .then((res) => res.json())
      .then((data) => {
        setDepartamentos(data);
      })
      .catch((err) => console.error("Error al cargar departamentos:", err));
  }, []);

  const handleDeptChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    // idx pasar id a str
    const idx = parseInt(id, 10);
    const departamento = departamentos.find((d) => d.id === idx);

    setDeptSel(id);
    setForm({
      ...form,
      deptSel: id,
      name_departamento: departamento ? departamento.name : "",
    });

    fetch(`https://api-colombia.com/api/v1/Department/${id}/cities`)
      .then((res) => res.json())
      .then((data) => {
        setMunicipios(data);
      })
      .catch((err) => {
        console.error("Error al cargar municipios:", err);
        setMunicipios([]);
      });
  };

  const handleCiudadChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setForm({ ...form, ciudad: name });
  };

  const [data, setData] = useState<FormData[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (form.nombre.length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres";
    }

    if (!form.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    }

    if (!form.tipoDocumento) {
      newErrors.tipoDocumento = "Selecciona un tipo de documento";
    }

    if (!form.estadoCivil) {
      newErrors.estadoCivil = "Selecciona un tipo de estado civil";
    }

    if (!form.genero) {
      newErrors.genero = "Selecciona un tipo de genero";
    }

    if (!form.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "El número de documento es obligatorio";
    } else if (!/^\d+$/.test(form.numeroDocumento)) {
      newErrors.numeroDocumento = "Debe contener solo números";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{7,10}$/.test(form.telefono)) {
      newErrors.telefono = "Teléfono inválido (7-10 dígitos)";
    }

    if (!form.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    }

    if (!form.direccion.trim()) {
      newErrors.direccion = "La direccion es obligatoria";
    }

    if (!form.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es obligatoria";
    }

    console.log("deptSe  l", form.deptSel);
    if (!form.deptSel) {
      newErrors.deptSel = "El departamento es obligatorio";
    }

    if (!form.ocupacion.trim()) {
      newErrors.ocupacion = "La ocupación es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "nombre":
        if (!value.trim()) error = "El nombre es obligatorio";
        else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
        break;

      case "apellidos":
        if (!value.trim()) error = "Los apellidos son obligatorios";
        break;

      case "numeroDocumento":
        if (!value.trim()) error = "El número de documento es obligatorio";
        else if (!/^\d+$/.test(value)) error = "Debe contener solo números";
        break;

      case "email":
        if (!value.trim()) error = "El correo es obligatorio";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Formato inválido";
        break;

      case "telefono":
        if (!value.trim()) error = "El teléfono es obligatorio";
        else if (!/^\d{7,10}$/.test(value))
          error = "Debe tener entre 7 y 10 dígitos";
        break;

      case "fechaNacimiento":
        if (!value) error = "La fecha es obligatoria";
        break;

      case "direccion":
        if (!value.trim()) error = "La direccion es obligatoria";
        break;

      case "ciudad":
        if (!value.trim()) error = "La ciudad es obligatoria";
        break;

      case "ocupacion":
        if (!value.trim()) error = "La ocupación es obligatoria";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // validación en tiempo real

    console.log("name", name);
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // 🚨 si hay errores no sigue

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
      deptSel: "",
      estadoCivil: "",
      ocupacion: "",
      name_departamento: "",
    });
    setErrors({});
  };

  useEffect(() => {
    const stored = localStorage.getItem("registros");
    if (stored) setData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(data));
  }, [data]);

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
          <div>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className={`${inputClass} ${
                errors.nombre ? "border-red-500" : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Apellidos"
              className={`${inputClass} ${
                errors.apellidos ? "border-red-500" : ""
              }`}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>
          <div>
            <select
              name="tipoDocumento"
              value={form.tipoDocumento}
              onChange={handleChange}
              className={`${inputClass} ${
                errors.tipoDocumento ? "border-red-500" : ""
              }`}
            >
              <option value="">Tipo de documento</option>
              <option value="CC">Cédula</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PAS">Pasaporte</option>
            </select>
            {errors.tipoDocumento && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tipoDocumento}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="numeroDocumento"
              value={form.numeroDocumento}
              onChange={handleChange}
              placeholder="Número de Documento"
              className={`${inputClass} ${
                errors.numeroDocumento ? "border-red-500" : ""
              }`}
            />
            {errors.numeroDocumento && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numeroDocumento}
              </p>
            )}
          </div>
          <div>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              className={`${inputClass} ${
                errors.fechaNacimiento ? "border-red-500" : ""
              }`}
            />
            {errors.fechaNacimiento && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fechaNacimiento}
              </p>
            )}
          </div>
          <div>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className={`${inputClass} ${
                errors.genero ? "border-red-500" : ""
              }`}
            >
              <option value="">Género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
            {errors.genero && (
              <p className="text-red-500 text-sm mt-1">{errors.genero}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={`${inputClass} ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className={`${inputClass} ${
                errors.telefono ? "border-red-500" : ""
              }`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>
          <div>
            <select
              name="deptSel"
              onChange={handleDeptChange}
              className={`${inputClass} ${
                errors.deptSel ? "border-red-500" : ""
              }`}
              value={deptSel}
            >
              <option value="">Seleccione Departamento</option>
              {departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
            {errors.deptSel && (
              <p className="text-red-500 text-sm mt-1">{errors.deptSel}</p>
            )}
          </div>
          <div>
            <select
              disabled={!municipios.length}
              name="ciudad"
              onChange={handleCiudadChange}
              className={`${inputClass} ${
                errors.ciudad ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione Municipio</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.ciudad && (
              <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className={`${inputClass} ${
                errors.direccion ? "border-red-500" : ""
              }`}
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          <div>
            <select
              name="estadoCivil"
              value={form.estadoCivil}
              onChange={handleChange}
              className={`${inputClass} ${
                errors.estadoCivil ? "border-red-500" : ""
              }`}
            >
              <option value="">Estado Civil</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Unión Libre">Unión Libre</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
            </select>
            {errors.estadoCivil && (
              <p className="text-red-500 text-sm mt-1">{errors.estadoCivil}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="ocupacion"
              value={form.ocupacion}
              onChange={handleChange}
              placeholder="Ocupación"
              className={`${inputClass} ${
                errors.ocupacion ? "border-red-500" : ""
              }`}
            />
            {errors.ocupacion && (
              <p className="text-red-500 text-sm mt-1">{errors.ocupacion}</p>
            )}
          </div>

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
                {item.direccion} - {item.ciudad} - {item.name_departamento}
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
