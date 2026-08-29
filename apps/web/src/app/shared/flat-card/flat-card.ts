import { Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import type { Flat } from '@flatfinder/types';

/**
 * Tarjeta de piso. El mismo bloque estaba copiado en el listado, en mis
 * pisos, en favoritos y en el detalle; aqui vive una sola vez y cada pantalla
 * proyecta sus propias acciones.
 */
@Component({
  selector: 'app-flat-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './flat-card.html',
  styleUrl: './flat-card.css',
})
export class FlatCard {
  readonly flat = input.required<Flat>();
}
