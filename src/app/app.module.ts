import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { CtaBannerComponent } from './components/cta-banner/cta-banner.component';
import { TestimonialCarouselComponent } from './components/testimonial-carousel/testimonial-carousel.component';
import { FaqAccordionComponent } from './components/faq-accordion/faq-accordion.component';
import { MetricsCounterComponent } from './components/metrics-counter/metrics-counter.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { CaseStudiesComponent } from './pages/case-studies/case-studies.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';

import { PortfolioComponent } from './pages/portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    CtaBannerComponent,
    TestimonialCarouselComponent,
    FaqAccordionComponent,
    MetricsCounterComponent,
    HomeComponent,
    ServicesComponent,
    CaseStudiesComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
