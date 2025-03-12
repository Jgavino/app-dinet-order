import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'app-layaout',
  standalone: true,
  imports: [NavbarComponent, BodyComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void {}
}
