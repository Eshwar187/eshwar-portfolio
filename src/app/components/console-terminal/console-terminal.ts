import { Component, ElementRef, OnInit, AfterViewChecked, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

@Component({
  selector: 'app-console-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './console-terminal.html',
  styleUrl: './console-terminal.css'
})
export class ConsoleTerminal implements OnInit, AfterViewChecked {
  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  private inputField = viewChild<ElementRef<HTMLInputElement>>('inputField');

  inputValue = '';
  history: TerminalLine[] = [];

  ngOnInit() {
    this.printWelcomeMessage();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  focusInput() {
    const field = this.inputField();
    if (field) {
      field.nativeElement.focus();
    }
  }

  handleCommand() {
    const cmd = this.inputValue.trim().toLowerCase();
    if (!cmd) return;

    // Echo input command
    this.history.push({ text: `guest@eshwar.dev:~$ ${this.inputValue}`, type: 'input' });
    this.inputValue = '';

    // Process commands
    switch (cmd) {
      case 'help':
        this.printHelp();
        break;
      case 'clear':
        this.history = [];
        break;
      case 'about':
        this.printAbout();
        break;
      case 'projects':
        this.printProjects();
        break;
      case 'skills':
        this.printSkills();
        break;
      case 'contact':
        this.printContact();
        break;
      case 'neofetch':
        this.printNeofetch();
        break;
      default:
        this.history.push({ text: `shell: command not found: "${cmd}". Type "help" to display interface options.`, type: 'error' });
    }
  }

  private printWelcomeMessage() {
    this.history = [
      { text: '   _____  _____  _    _ __          __  _____ ', type: 'success' },
      { text: '  |  ___|/ ____|| |  | |\\ \\        / / |  __ \\', type: 'success' },
      { text: '  | |__ | (___  | |__| | \\ \\  /\\  / /  | |__) |', type: 'success' },
      { text: '  |  __| \\___ \\ |  __  |  \\ \\/  \\/ /   |  _  / ', type: 'success' },
      { text: '  | |___ ____) || |  | |   \\  /\\  /    | | \\ \\ ', type: 'success' },
      { text: '  |_____|_____/ |_|  |_|    \\/  \\/     |_|  \\_\\', type: 'success' },
      { text: ' ', type: 'system' },
      { text: 'ESHWAR.DEV [Version 11.0.4 - Holographic HUD Console]', type: 'system' },
      { text: 'Established secure connection node: Bangalore Node [12.97° N, 77.59° E]', type: 'system' },
      { text: 'Type "help" to list available telemetry shell commands.', type: 'output' },
      { text: ' ', type: 'output' }
    ];
  }

  private printHelp() {
    this.history.push(
      { text: 'Available telemetry shell commands:', type: 'success' },
      { text: '  about      - Display developer profile information summary', type: 'output' },
      { text: '  projects   - Query selected work specifications and repository nodes', type: 'output' },
      { text: '  skills     - Print technical matrix details', type: 'output' },
      { text: '  contact    - Transmit secure inquiry details', type: 'output' },
      { text: '  neofetch   - Pull system hardware & software specifications', type: 'output' },
      { text: '  clear      - Wipe terminal console history buffer', type: 'output' },
      { text: ' ', type: 'output' }
    );
  }

  private printAbout() {
    this.history.push(
      { text: 'DEVELOPER PROFILE INQUIRY // ESHWAR:', type: 'success' },
      { text: '  Senior Full Stack Developer specializing in low-latency backend engines (Go, Node.js) and custom high-fidelity web client systems (Angular standalone, RxJS, custom Web Components).', type: 'output' },
      { text: '  Focus coordinates: Zero-waste performance optimization, microservice cluster engineering, and dynamic responsive user layouts.', type: 'output' },
      { text: ' ', type: 'output' }
    );
  }

  private printProjects() {
    this.history.push(
      { text: 'SELECTED TELEMETRY NODE SHOWCASES:', type: 'success' },
      { text: '  01 // AURA DB: Go-based distributed key-value store. Raft consensus loggers. Benchmarked at 500k req/sec.', type: 'output' },
      { text: '  02 // QUANTUM UI: Performance web components design system. Storybook, custom HSL color-tokens.', type: 'output' },
      { text: '  03 // AETHER CI: Real-time Kubernetes container CI visualizer. WebSockets telemetry streams.', type: 'output' },
      { text: '  * Select widgets in the main grid or scroll down to view specifications.', type: 'system' },
      { text: ' ', type: 'output' }
    );
  }

  private printSkills() {
    this.history.push(
      { text: 'TECHNICAL MATRIX STACK:', type: 'success' },
      { text: '  FRONTEND: Angular 21, TypeScript, RxJS, Signals, GSAP, SCSS, WebComponents', type: 'output' },
      { text: '  BACKEND: Go (Golang), Node.js, NestJS, gRPC, Protobuf, WebSockets, REST, GraphQL', type: 'output' },
      { text: '  DATABASE: PostgreSQL, Redis Clusters, MongoDB, Elasticsearch, Prisma ORM', type: 'output' },
      { text: '  DEV-OPS: Docker, Kubernetes, AWS, GitHub Actions CI/CD, Linux Shell scripting', type: 'output' },
      { text: ' ', type: 'output' }
    );
  }

  private printContact() {
    this.history.push(
      { text: 'TRANSMISSION UPLINK ADDRESS:', type: 'success' },
      { text: '  Mail Node: contact@eshwar.dev', type: 'output' },
      { text: '  Active Location: Bangalore Node [12.97° N, 77.59° E]', type: 'output' },
      { text: '  Status Code: Available for contractual/architecture consultations.', type: 'success' },
      { text: ' ', type: 'output' }
    );
  }

  private printNeofetch() {
    this.history.push(
      { text: '   /\_/\     eshwar@holograph-hud', type: 'success' },
      { text: '  ( o.o )    --------------------', type: 'success' },
      { text: '   > ^ <     OS: Antigravity OS v11.0.2', type: 'output' },
      { text: '             Host: Angular Standalone Console', type: 'output' },
      { text: '             Kernel: Webkit V8 Sandbox Engine', type: 'output' },
      { text: '             Uptime: ' + Math.floor(performance.now() / 1000) + 's', type: 'output' },
      { text: '             Resolution: ' + window.innerWidth + 'x' + window.innerHeight + ' PX', type: 'output' },
      { text: '             Framework: Angular 21.2.0 (Zoneless)', type: 'output' },
      { text: '             Core: GSAP ScrollTrigger & Liquid Canvas', type: 'output' },
      { text: '             Glow Theme: Cyberpunk Neon (Cyan / Pink)', type: 'success' },
      { text: ' ', type: 'output' }
    );
  }

  private scrollToBottom() {
    const container = this.scrollContainer();
    if (container) {
      container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
    }
  }
}
