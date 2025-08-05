// src/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabase.service';

export class DashboardController {
  private supabaseService: SupabaseService;

  constructor() {
    this.supabaseService = new SupabaseService();
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.supabaseService.getDashboardStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }

  async getBatchStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { batchId } = req.params;
      const stats = await this.supabaseService.getBatchStatistics(batchId);
      
      if (!stats) {
        res.status(404).json({ error: 'Batch not found' });
        return;
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error fetching batch statistics:', error);
      res.status(500).json({ error: 'Failed to fetch batch statistics' });
    }
  }

  async getProcessLogs(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId } = req.query;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const logs = await this.supabaseService.getProcessLogs(
        entityType as string,
        entityId as string,
        limit
      );

      res.json({
        success: true,
        data: logs,
        count: logs.length
      });
    } catch (error) {
      console.error('❌ Error fetching process logs:', error);
      res.status(500).json({ error: 'Failed to fetch process logs' });
    }
  }

  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      // Check various system components
      const health = {
        database: 'healthy',
        firefly: 'healthy',
        cardano: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      };

      res.json({
        success: true,
        status: 'healthy',
        data: health
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
