import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit {
  ngOnInit(): void {}
}
