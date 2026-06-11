import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- 1. Importamos esta herramienta para los formularios

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule], // <-- 2. Le decimos a Angular que la vamos a usar
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  esRegistro: boolean = false; // Controla qué pantalla mostrar
  videojuegos: any[] = [];
  
  // Variables para el Login
  token: string | null = null;
  emailLogin: string = '';
  passwordLogin: string = '';

  // Variables para el Carrito
  mostrarCarrito: boolean = false;
  itemsCarrito: any[] = [];
  totalPagar: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Cuando cargue la página, revisamos si el usuario ya se había logueado antes
    this.token = localStorage.getItem('token_ecommerce');
    if (this.token) {
      this.cargarCatalogo();
    }
  }

  // Función que se ejecuta al darle clic al botón "Entrar"
  iniciarSesion() {
    const credenciales = { 
      email: this.emailLogin, 
      password: this.passwordLogin 
    };

    this.http.post('http://localhost:3000/api/auth/login', credenciales).subscribe({
      next: (respuesta: any) => {
        // Si el backend dice que todo está bien, guardamos el token
        this.token = respuesta.token;
        localStorage.setItem('token_ecommerce', this.token!); // Lo guardamos en el navegador
        this.cargarCatalogo(); // Cargamos los juegos
      },
      error: (err) => {
        alert('Error: Correo o contraseña incorrectos.');
        console.error(err);
      }
    });
  }

  cerrarSesion() {
    // Borramos el token y vaciamos el catálogo para regresar al Login
    this.token = null;
    localStorage.removeItem('token_ecommerce');
    this.videojuegos = [];
    this.emailLogin = '';
    this.passwordLogin = '';
  }

  cargarCatalogo() {
    this.http.get('http://localhost:3000/api/videogames').subscribe({
      next: (respuesta: any) => {
        this.videojuegos = respuesta.data;
      },
      error: (err) => {
        console.error('Ocurrió un error al traer los juegos:', err);
      }
    });
  }

  agregarAlCarrito(idJuego: number) {
    if (!this.token) {
      alert('Necesitas iniciar sesión primero.');
      return;
    }

    // 1. Decodificamos el token usando JavaScript puro para sacar tu user_id
    // El token tiene 3 partes separadas por un punto. La de en medio tiene tus datos.
    const payload = JSON.parse(atob(this.token.split('.')[1]));
    const miUsuarioId = payload.id;

    // 2. Armamos el paquete con los datos que espera tu backend
    const ordenDeCompra = {
      user_id: miUsuarioId,
      videogame_id: idJuego,
      cantidad: 1 // Por defecto agregamos 1 copia a la vez
    };

    // 3. Preparamos el gafete de seguridad en los Encabezados (Headers)
    const misHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // 4. Hacemos la petición POST a tu ruta protegida del carrito
    this.http.post('http://localhost:3000/api/cart/add', ordenDeCompra, { headers: misHeaders })
      .subscribe({
        next: (respuesta: any) => {
          alert('¡Juego agregado al carrito con éxito! 🛒');
        },
        error: (err) => {
          console.error('Error del servidor:', err);
          alert('Hubo un error al intentar agregar el juego.');
        }
      });
  }

  abrirCarrito() {
    this.mostrarCarrito = true;
    this.obtenerCarrito(); // Cada vez que abrimos la pestaña, vamos por los datos frescos
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  obtenerCarrito() {
    if (!this.token) return;

    // Decodificamos el token para saber quién es el usuario
    const payload = JSON.parse(atob(this.token.split('.')[1]));
    const miUsuarioId = payload.id;

    const misHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // Hacemos un GET a la ruta que programaste en tu backend
    this.http.get(`http://localhost:3000/api/cart/${miUsuarioId}`, { headers: misHeaders })
      .subscribe({
        next: (respuesta: any) => {
          this.itemsCarrito = respuesta.items;
          this.totalPagar = respuesta.total_pagar;
        },
        error: (err) => {
          console.error('Error al obtener tu carrito:', err);
        }
      });
  }
  // Agrega esta función para poder usarla en el botón de pagar
  alertaPago() {
    alert('¡Integración con pagos próximamente!');
  }
  // 1. Agrega esta variable junto a tus otras variables (como emailLogin, passwordLogin)
nombreRegistro: string = '';

// 2. Actualiza tu función registrarUsuario para incluir el nombre
registrarUsuario() {
  const nuevosDatos = {
    nombre: this.nombreRegistro, // <-- El backend ahora recibirá el nombre
    email: this.emailLogin,
    password: this.passwordLogin
  };

  this.http.post('http://localhost:3000/api/auth/register', nuevosDatos).subscribe({
    next: () => {
      alert('Registro exitoso. Ahora inicia sesión.');
      this.esRegistro = false; 
      this.nombreRegistro = ''; // Limpiamos el campo
    },
    error: (err) => {
      alert('Error al registrar: ' + err.error.message);
    }
  });
}
}