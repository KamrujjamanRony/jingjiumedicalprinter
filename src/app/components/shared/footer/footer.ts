import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AboutM, ContactM } from '../../../utils/models';
import { ContactS } from '../../../services/contact-s';
import { environment } from '../../../../environments/environment';
import { AboutS } from '../../../services/about-s';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements OnInit {
  private contactService = inject(ContactS);
  private aboutService = inject(AboutS);
  
  // Signal State
  contactInfo = signal<ContactM | null>(null);
    about = signal<AboutM | null>(null);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  
  // Computed Properties
  currentYear = computed(() => new Date().getFullYear());
  companyName = computed(() => environment.companyName || 'SuperSoft');
  
  hasSocialLinks = computed(() => {
    const info = this.contactInfo();
    return info?.facebookLink || info?.othersLink1 || info?.othersLink2;
  });

  ngOnInit(): void {
    this.loadContactInfo();
    this.loadAboutInfo();
  }

  loadContactInfo(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.contactService.get(environment.companyCode).subscribe({
      next: (data) => {
        this.contactInfo.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading contact info:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
  loadAboutInfo(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.aboutService.get(environment.companyCode).subscribe({
      next: (data) => {
        this.about.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading about info:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Ensure URLs have proper protocol
   */
  getFullUrl(url: string | undefined): string {
    if (!url) return '#';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  }
}